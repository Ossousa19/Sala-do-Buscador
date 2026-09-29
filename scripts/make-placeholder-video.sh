#!/usr/bin/env bash
# Synthetic "walk into the door" zoom from the still (placeholder until the real hero video exists).
# Usage: scripts/make-placeholder-video.sh [desktop|mobile] [still] [out.mp4]
#   desktop → 1920×856 (the still's own 2.24:1 framing), 120 frames, zoom 1 → ZMAX (default 3.5)
#   mobile  → 900×1600 portrait, cropped from the still around the door BEFORE zooming (so no
#             upscaled landscape crop), 80 frames, zoom 1 → ZMAX (default 1.8)
# The zoom is exponential (constant perceived speed) and centred on the door opening
# (x 50%, y 57% of the still). Keeping ZMAX ≈3 (3.5 desktop: the smallest zoom whose last frame sits inside the opening at 1024×768, 1.8 mobile) avoids the pixelation of the old 5.2× zoom
# while still ending inside the door on the starry sky.
set -euo pipefail
VARIANT="${1:-desktop}"
SRC="${2:-public/images/hero/door-still.png}"
OUT="${3:-/tmp/hero-placeholder-$VARIANT.mp4}"
if [ ! -f "$SRC" ]; then
  echo "Source still not found: $SRC" >&2
  echo "public/images/hero/door-still.png is gitignored; regenerate it from the Figma bg + arch (see Task 3, step 2) or pass another image as \$2." >&2
  exit 1
fi
case "$VARIANT" in
  desktop) N=120; ZMAX="${ZMAX:-3.5}"; PRE="scale=5760:-2"; SIZE=1920x856 ;;
  # 9:16 crop of the full still height, centred on the door, then upscaled 4× so zoompan's
  # integer crop offsets don't jitter.
  mobile) N=80; ZMAX="${ZMAX:-1.8}"; PRE="crop=trunc(ih*9/16/2)*2:ih,scale=-2:5136"; SIZE=900x1600 ;;
  *) echo "variant must be desktop or mobile" >&2; exit 1 ;;
esac
ffmpeg -v error -y -loop 1 -i "$SRC" \
  -vf "$PRE,zoompan=z='pow($ZMAX,on/($N-1))':x='iw/2-(iw/zoom/2)':y='ih*0.57-(ih/zoom/2)':d=$N:s=$SIZE:fps=24" \
  -frames:v "$N" -pix_fmt yuv420p -c:v libx264 -crf 14 "$OUT"
echo "$OUT"
