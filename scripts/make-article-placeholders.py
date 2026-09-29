"""TEMPORARY article covers (1280×720) derived from existing site imagery, darkened so they sit
on the velvet section. Replace with the real article photos (see content/site.ts TODOs).
Usage: python3 scripts/make-article-placeholders.py"""
from PIL import Image, ImageDraw

W, H = 1280, 720
NIGHT = (12, 4, 4)
WINE = (59, 10, 10)


def crop169(img, cx=0.5, cy=0.5, zoom=1.0):
    iw, ih = img.size
    w = min(iw, ih * 16 / 9) / zoom
    h = w * 9 / 16
    x = min(max(cx * iw - w / 2, 0), iw - w)
    y = min(max(cy * ih - h / 2, 0), ih - h)
    return img.crop((round(x), round(y), round(x + w), round(y + h))).resize((W, H), Image.LANCZOS)


def darken(img, top=0.15, bottom=0.55, tint=None, tint_alpha=0):
    img = img.convert("RGB")
    if tint:
        img = Image.blend(img, Image.new("RGB", img.size, tint), tint_alpha)
    shade = Image.new("L", (1, H))
    for y in range(H):
        shade.putpixel((0, y), round(255 * (top + (bottom - top) * (y / (H - 1)) ** 1.4)))
    shade = shade.resize((W, H))
    # soft vignette on the sides
    vign = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(vign)
    for i in range(60):
        d.rectangle((i * 4, i * 2, W - i * 4, H - i * 2), outline=round(90 * (1 - i / 60)))
    combined = Image.new("L", (W, H))
    combined.paste(shade)
    from PIL import ImageChops

    combined = ImageChops.lighter(combined, vign)
    return Image.composite(Image.new("RGB", (W, H), NIGHT), img, combined)


jobs = [
    # 1 · Evangelho de Tomé → the arch of the Sala (hidden sayings behind the door), wine cast
    ("placeholder-1", darken(crop169(Image.open("public/images/hero/door-still.webp"), 0.5, 0.42, 1.25), 0.05, 0.45, WINE, 0.12)),
    # 2 · Bardo Thödol → the cosmos over the clouds (the crossing)
    ("placeholder-2", darken(crop169(Image.open("public/images/salas/space.webp"), 0.5, 0.52, 1.25), 0.05, 0.45)),
    # 3 · Tao Te Ching → the stairway climbing into the light (the way)
    ("placeholder-3", darken(crop169(Image.open("public/images/perguntas/scene.webp"), 0.62, 0.4, 1.35), 0.05, 0.4)),
]
for name, img in jobs:
    img.save(f"public/images/artigos/{name}.webp", "WEBP", quality=80, method=6)
    print(name, img.size)
