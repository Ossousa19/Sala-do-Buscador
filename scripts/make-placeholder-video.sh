#!/usr/bin/env bash
# Synthetic zoom "into the door" from the still. Replaced by the Magnific video in Task 18.
set -euo pipefail
SRC="${1:-public/images/hero/door-still.png}"
OUT="${2:-/tmp/hero-placeholder.mp4}"
if [ ! -f "$SRC" ]; then
  echo "Source still not found: $SRC" >&2
  echo "public/images/hero/door-still.png is gitignored; regenerate it from the Figma bg + arch (see Task 3, step 2) or pass another image as \$1." >&2
  exit 1
fi
ffmpeg -v error -y -loop 1 -i "$SRC" \
  -vf "scale=5760:-2,zoompan=z='1+0.035*on':x='iw/2-(iw/zoom/2)':y='ih*0.57-(ih/zoom/2)':d=120:s=1920x856:fps=24" \
  -frames:v 120 -pix_fmt yuv420p -c:v libx264 "$OUT"
echo "$OUT"
