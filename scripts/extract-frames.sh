#!/usr/bin/env bash
# Requires ffmpeg + cwebp.
# Usage: scripts/extract-frames.sh <desktop-video> [mobile-video]
#   → public/frames/hero/{desktop,mobile} + content/hero-frames.json
# Without a mobile video, the mobile frames are a centred 9:16 crop of the desktop video.
set -euo pipefail
SRC="${1:?usage: extract-frames.sh <desktop-video> [mobile-video]}"
MSRC="${2:-}"
OUT="public/frames/hero"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

extract() {
  local variant=$1 count=$2 filter=$3 quality=$4 src=$5
  rm -rf "${OUT:?}/$variant" && mkdir -p "$OUT/$variant"
  local fps dur
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
  fps=$(awk -v c="$count" -v d="$dur" 'BEGIN { printf "%.4f", c / d }')
  # ffmpeg builds without libwebp: extract PNG frames, then encode each with cwebp.
  rm -rf "${TMP:?}"/*
  ffmpeg -v error -i "$src" -vf "fps=$fps,$filter" -frames:v "$count" "$TMP/frame_%04d.png"
  for f in "$TMP"/frame_*.png; do
    cwebp -quiet -q "$quality" -m 6 "$f" -o "$OUT/$variant/$(basename "${f%.png}").webp"
  done
  find "$OUT/$variant" -name '*.webp' | wc -l | tr -d ' '
}

D=$(extract desktop 120 "scale=1920:-2:flags=lanczos" 70 "$SRC")
if [ -n "$MSRC" ]; then
  M=$(extract mobile 80 "scale=900:-2:flags=lanczos" 65 "$MSRC")
else
  M=$(extract mobile 80 "crop=min(iw\,ih*9/16):ih,scale=900:-2:flags=lanczos" 65 "$SRC")
fi
printf '{ "desktop": %s, "mobile": %s }\n' "$D" "$M" > content/hero-frames.json
du -sh "$OUT/desktop" "$OUT/mobile"
