#!/usr/bin/env bash
# Requires ffmpeg + cwebp.
# Usage: scripts/extract-frames.sh <video>  → public/frames/hero/{desktop,mobile} + content/hero-frames.json
set -euo pipefail
SRC="${1:?usage: extract-frames.sh <video>}"
OUT="public/frames/hero"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC")

extract() {
  local variant=$1 count=$2 filter=$3 quality=$4
  rm -rf "${OUT:?}/$variant" && mkdir -p "$OUT/$variant"
  local fps
  fps=$(awk -v c="$count" -v d="$DUR" 'BEGIN { printf "%.4f", c / d }')
  # ffmpeg builds without libwebp: extract PNG frames, then encode each with cwebp.
  local tmp
  tmp=$(mktemp -d)
  ffmpeg -v error -i "$SRC" -vf "fps=$fps,$filter" "$tmp/frame_%04d.png"
  for f in "$tmp"/frame_*.png; do
    cwebp -quiet -q "$quality" -m 6 "$f" -o "$OUT/$variant/$(basename "${f%.png}").webp"
  done
  rm -rf "$tmp"
  find "$OUT/$variant" -name '*.webp' | wc -l | tr -d ' '
}

D=$(extract desktop 120 "scale=1920:-2:flags=lanczos" 70)
M=$(extract mobile 80 "crop=min(iw\,ih*9/16):ih,scale=900:-2:flags=lanczos" 65)
printf '{ "desktop": %s, "mobile": %s }\n' "$D" "$M" > content/hero-frames.json
du -sh "$OUT/desktop" "$OUT/mobile"
