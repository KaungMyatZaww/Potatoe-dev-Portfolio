#!/usr/bin/env python3
"""
Generate the ink-wash background textures.

The site's backgrounds are sumi (墨) washes. Vector approximations of a brush
stroke read as flat gradients, so the washes are pre-rendered here instead and
shipped as transparent WebP. Only the *wash* is raster: paper grain stays an
inline SVG turbulence filter, which tiles seamlessly and costs nothing.

Everything is deterministic — a fixed seed per asset — so re-running this
produces byte-comparable output and the textures can be tuned without churn.

Algorithm, per wash:

  1.  A tapered band is sampled along a cubic bezier ("the brush") and drawn as
      overlapping discs. A `taper` exponent controls how abruptly the brush
      loads and lifts.
  2.  Tendrils — thinner bands sharing the origin at a slight angle — are drawn
      over it, which is what gives a real sweep its feathered, fanning edge.
  3.  The radius is jittered from low-frequency noise along the path so the
      silhouette tears instead of being a clean lens.
  4.  Dry-brush: a directional fibre field is stretched along the stroke, then
      thresholded and multiplied into the alpha, punching the streaky gaps a
      drying brush leaves behind.
  5.  Granulation: a fine noise field modulates alpha again, imitating pigment
      settling into the tooth of rough paper.
  6.  Splatter: power-law droplets, some smeared along the stroke direction.
  7.  Bloom: a wide blur of the alpha is max-combined in, which is the halo of
      ink spreading into damp paper.

Usage:
    python3 tools/generate-ink-textures.py            # write public/textures
    python3 tools/generate-ink-textures.py --preview  # also write PNG previews
"""

import argparse
import math
import os
import random

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "textures")

WIDTH, HEIGHT = 1440, 900

# Ink is near-black on paper. On the dark surfaces the wash has to *lighter*
# than the page to read at all, so it becomes a dry brush of pale graphite.
INK_DARK = (20, 19, 18)
INK_LIGHT = (188, 186, 178)


# ---------------------------------------------------------------------------
# Noise
# ---------------------------------------------------------------------------


def _lattice(cells, rng):
    grid = Image.new("L", (cells, cells))
    grid.putdata(bytes(rng.randrange(256) for _ in range(cells * cells)))
    return grid


def noise(w, h, cells, rng):
    """Low-resolution random lattice, smoothly upsampled."""
    return _lattice(cells, rng).resize((w, h), Image.BICUBIC)


def fbm(w, h, seed, octaves=7, base=3, persistence=0.55, max_cells=384):
    """Fractal value noise, normalised to the full 0-255 range."""
    rng = random.Random(seed)
    amps = [persistence**i for i in range(octaves)]
    total = sum(amps)

    acc = Image.new("L", (w, h), 0)
    cells = base
    for amp in amps:
        layer = noise(w, h, cells, rng)
        # Scaling by a LUT keeps this in C; a per-pixel lambda would be ~1.3M
        # Python calls per octave.
        acc = ImageChops.add(acc, layer.point([int(v * amp / total) for v in range(256)]))
        cells = min(cells * 2, max_cells)

    # Averaging octaves pulls every field toward its mean, so the raw result
    # rarely spans the full range. Stretching it back makes every downstream
    # threshold a predictable fraction rather than a guess at the noise floor.
    return ImageOps.autocontrast(acc, cutoff=0)


def fibre_field(w, h, seed, squeeze, angle, octaves=6):
    """
    Directional dry-brush fibres running along `angle`.

    Noise is squeezed horizontally then restored, which smears it into fibres;
    the field is then rotated onto the stroke's axis. The rotation happens on a
    canvas large enough that the crop never reaches its corners: rotate() fills
    outside the source with black, and black is a *full* erase once thresholded,
    so a dead corner would tear a hole straight through the wash.
    """
    size = 2 * int(math.hypot(w, h) / 2) + 120
    field = fbm(size, size, seed=seed, octaves=octaves, base=2, persistence=0.58)
    field = field.resize((max(4, size // squeeze), size), Image.BICUBIC)
    field = field.resize((size, size), Image.BICUBIC)
    field = field.rotate(angle, resample=Image.BICUBIC)

    left = (size - w) // 2
    top = (size - h) // 2
    field = field.crop((left, top, left + w, top + h)).filter(ImageFilter.GaussianBlur(1.1))

    # The directional squeeze interpolates heavily and drags the field toward
    # its mean — barely a few percent of it ever reached the top of the range,
    # which left the dry threshold cutting through the middle of a bell rather
    # than separating ink from paper. Restore the full range after the stretch.
    return ImageOps.autocontrast(field, cutoff=1)


def curve(lo, hi=1.0):
    """Build a 256-entry LUT remapping [lo, hi] onto the full range."""
    span = max(1e-6, hi - lo)
    return [int(max(0, min(255, (v / 255.0 - lo) / span * 255))) for v in range(256)]


def scaled(amount):
    """LUT that multiplies by `amount`."""
    return [int(v * amount) for v in range(256)]


# ---------------------------------------------------------------------------
# Brush geometry
# ---------------------------------------------------------------------------


def sample_brush(origin, end, bow, half_width, taper=0.55, bias=0.0, steps=280):
    """
    Sample a tapered brush path as (x, y, radius) discs.

    `half_width` is the radius at the fattest point; `taper` bends the width
    profile (lower = a longer, fuller body); `bias` shifts where the brush is
    fattest along the path, which is how a real stroke reads when the brush
    lands heavily and lifts dry.
    """
    ax, ay = origin
    bx, by = end
    dx, dy = bx - ax, by - ay
    length = math.hypot(dx, dy) or 1.0
    nx, ny = -dy / length, dx / length

    c1 = (ax + dx * 0.33 + nx * bow, ay + dy * 0.33 + ny * bow)
    c2 = (ax + dx * 0.67 + nx * bow, ay + dy * 0.67 + ny * bow)

    # Load then lift: a sine swell whose crest sits at `peak` along the path.
    peak = min(0.85, max(0.15, 0.5 - bias * 0.5))
    ramp = peak
    fall = 1.0 - peak

    discs = []
    for i in range(steps + 1):
        t = i / steps
        u = 1 - t
        x = u**3 * ax + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t**3 * bx
        y = u**3 * ay + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t**3 * by

        # 0 at both tips, 1 at the crest — a half-sine either side of the peak.
        swell = math.sin(math.pi / 2 * (t / ramp)) if t < ramp else math.sin(math.pi / 2 * ((1 - t) / fall))
        radius = half_width * max(0.0, swell) ** taper
        discs.append((x, y, radius))

    return discs


def draw_discs(draw, discs, fill=255, jitter_img=None, jitter_scale=0.0):
    """Draw the discs, optionally tearing the radius from a noise field."""
    for x, y, radius in discs:
        if jitter_img is not None and jitter_scale:
            sample = jitter_img.getpixel((min(WIDTH - 1, max(0, int(x))), min(HEIGHT - 1, max(0, int(y)))))
            radius *= 1.0 + jitter_scale * ((sample / 255.0) - 0.5) * 2.0
        radius = max(0.5, radius)
        draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=fill)


def splatter(draw, rng, count, origin, spread, angle, r_min=1.4, r_max=9.0, smear=0.0):
    """Power-law droplets; some smeared into comets along the stroke direction."""
    for _ in range(count):
        t = rng.random() ** 3  # bias hard toward small droplets
        radius = r_min + (r_max - r_min) * t

        x = origin[0] + rng.gauss(0, spread[0])
        y = origin[1] + rng.gauss(0, spread[1])
        if not (0 <= x < WIDTH and 0 <= y < HEIGHT):
            continue

        if smear and rng.random() < 0.3:
            length = smear * (0.4 + rng.random())
            dx = math.cos(angle) * length
            dy = math.sin(angle) * length
            draw.line((x, y, x + dx, y + dy), fill=255, width=max(1, int(radius * 1.4)))
        else:
            draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=255)


# ---------------------------------------------------------------------------
# Composition
# ---------------------------------------------------------------------------


def build_mask(spec, seed):
    """Render the alpha channel for one wash."""
    rng = random.Random(seed)
    mask = Image.new("L", (WIDTH, HEIGHT), 0)
    draw = ImageDraw.Draw(mask)

    # Low-frequency field used both for edge tearing and, later, granulation.
    tear = fbm(WIDTH, HEIGHT, seed=seed + 1, octaves=6, base=4, persistence=0.5)

    for stroke in spec["strokes"]:
        discs = sample_brush(
            origin=stroke["from"],
            end=stroke["to"],
            bow=stroke.get("bow", 0),
            half_width=stroke["half"],
            taper=stroke.get("taper", 0.55),
            bias=stroke.get("bias", 0.0),
        )
        draw_discs(draw, discs, jitter_img=tear, jitter_scale=stroke.get("jitter", 0.55))

    for tendril in spec.get("tendrils", []):
        discs = sample_brush(
            origin=tendril["from"],
            end=tendril["to"],
            bow=tendril.get("bow", 0),
            half_width=tendril["half"],
            taper=tendril.get("taper", 0.8),
            bias=tendril.get("bias", 0.0),
        )
        draw_discs(draw, discs, jitter_img=tear, jitter_scale=tendril.get("jitter", 0.75))

    for drop in spec.get("splatter", []):
        splatter(
            draw,
            rng,
            count=drop["count"],
            origin=drop["at"],
            spread=drop["spread"],
            angle=drop.get("angle", 0),
            r_max=drop.get("r_max", 9.0),
            smear=drop.get("smear", 0.0),
        )

    # 4. Dry brush — fibres stretched along the stroke, thresholded into gaps.
    fibre = fibre_field(
        WIDTH,
        HEIGHT,
        seed=seed + 7,
        squeeze=spec.get("fibre_squeeze", 22),
        angle=spec.get("fibre_angle", 0.0),
    )
    # The threshold saturates at the top of its window, so the field splits into
    # three bands rather than scaling everything down: dry gaps, a short ramp,
    # and fully loaded ink. A wide window would leave every pixel at a partial
    # alpha and the stroke would have no solid body at all.
    #
    # The erosion is then *blended* back toward the un-eroded stroke rather than
    # applied outright. A loaded brush dries out at its feathered edges while
    # the pressed core stays solid, so eroding uniformly punched holes straight
    # through the middle of the wash.
    floor = spec.get("dry", 0.36)
    holes = fibre.point(curve(floor, floor + spec.get("dry_span", 0.22)))
    mask = Image.blend(mask, ImageChops.multiply(mask, holes), spec.get("dry_mix", 0.72))

    # 5. Granulation — pigment settling into the paper's tooth. This modulates
    # alpha rather than erasing it, so the floor is kept high (0.74) to mottle
    # the ink instead of thinning it out.
    grain = fbm(WIDTH, HEIGHT, seed=seed + 13, octaves=5, base=6, persistence=0.5)
    mask = ImageChops.multiply(mask, grain.point([int(189 + 66 * (v / 255.0)) for v in range(256)]))

    # 7. Bloom — ink bleeding into damp paper, as a halo around the solid body.
    bloom = mask.filter(ImageFilter.GaussianBlur(spec.get("bloom_radius", 26)))
    mask = ImageChops.lighter(mask, bloom.point(scaled(spec.get("bloom", 0.42))))

    # Round the alpha to a coarse step before saving: WebP holds the alpha
    # channel losslessly, so soft noise-cluttered alpha is what makes these
    # files large. A step of 2 is beneath perceptibility on a blurry wash and
    # roughly halves the channel's entropy.
    mask = mask.point([(v >> 1) << 1 for v in range(256)])

    return mask, spec


def render(spec, seed):
    mask, _ = build_mask(spec, seed)
    colour = spec["colour"]
    image = Image.new("RGBA", (WIDTH, HEIGHT), colour + (0,))
    image.putalpha(mask)
    return image


ASSETS = {
    # Hero — sumi pooled into the bottom right, thrown along the right edge and
    # dragged back across the page as dry tendrils. Anchored to the reference:
    # the wash's left boundary sits near 60% width at the top and walks in to
    # roughly 38% at the bottom, so the mass widens as it descends.
    "wash-hero": {
        "colour": INK_DARK,
        "fibre_angle": 82,
        "fibre_squeeze": 16,
        "dry": 0.26,
        "dry_span": 0.2,
        "bloom": 0.42,
        "bloom_radius": 34,
        "strokes": [
            {"from": (1640, 1200), "to": (1450, -240), "half": 300, "bow": -120, "taper": 0.5, "bias": -0.35, "jitter": 0.45},
        ],
        "tendrils": [
            {"from": (1600, 1180), "to": (700, 470), "half": 76, "bow": -70, "jitter": 0.8},
            {"from": (1650, 1210), "to": (960, 790), "half": 112, "bow": -50, "jitter": 0.7},
            {"from": (1530, 250), "to": (1190, -180), "half": 46, "bow": 40, "jitter": 0.9},
            {"from": (1570, 700), "to": (1000, 320), "half": 38, "bow": -30, "jitter": 0.95},
            {"from": (1480, 600), "to": (130, 520), "half": 28, "bow": -22, "jitter": 1.05},
        ],
        "splatter": [
            {"at": (1120, 300), "spread": (250, 260), "count": 120, "r_max": 11, "angle": 1.44, "smear": 30},
            {"at": (1310, 720), "spread": (170, 240), "count": 90, "r_max": 13, "angle": 1.44, "smear": 36},
            {"at": (860, 560), "spread": (240, 200), "count": 50, "r_max": 6, "angle": 1.44, "smear": 18},
        ],
    },
    # Experience — the same language anchored to the opposite corner, so the two
    # paper sections read as facing pages rather than a repeat.
    "wash-band": {
        "colour": INK_DARK,
        "fibre_angle": -74,
        "fibre_squeeze": 16,
        "dry": 0.26,
        "dry_span": 0.2,
        "bloom": 0.4,
        "bloom_radius": 30,
        "strokes": [
            {"from": (-270, 1250), "to": (140, -200), "half": 265, "bow": 125, "taper": 0.5, "bias": -0.35, "jitter": 0.45},
        ],
        "tendrils": [
            {"from": (-180, 1210), "to": (660, 520), "half": 72, "bow": 60, "jitter": 0.8},
            {"from": (-230, 1250), "to": (430, 860), "half": 100, "bow": 44, "jitter": 0.7},
            {"from": (40, 210), "to": (-140, -150), "half": 44, "bow": -30, "jitter": 0.9},
            {"from": (-10, 690), "to": (600, 330), "half": 34, "bow": 28, "jitter": 1.0},
        ],
        "splatter": [
            {"at": (520, 900), "spread": (300, 180), "count": 90, "r_max": 10, "angle": -1.31, "smear": 28},
            {"at": (300, 380), "spread": (220, 220), "count": 50, "r_max": 6, "angle": -1.31, "smear": 18},
        ],
    },
    # Dark surfaces — a dry pale brush dragged across the page. Less bloom and a
    # higher dry threshold: on black, bloom reads as fog rather than as paper.
    "streak-corner": {
        "colour": INK_LIGHT,
        "fibre_angle": -22,
        "fibre_squeeze": 18,
        "dry": 0.4,
        "dry_span": 0.26,
        "bloom": 0.3,
        "bloom_radius": 24,
        "strokes": [
            {"from": (-230, 1120), "to": (1080, 590), "half": 210, "bow": -70, "taper": 0.66, "bias": 0.1, "jitter": 0.75},
        ],
        "tendrils": [
            {"from": (-140, 1050), "to": (720, 760), "half": 46, "bow": -30, "jitter": 1.0},
            {"from": (200, 1150), "to": (1480, 850), "half": 30, "bow": -24, "jitter": 1.05},
            {"from": (560, 980), "to": (1180, 1080), "half": 22, "bow": 20, "jitter": 1.1},
        ],
        "splatter": [
            {"at": (760, 900), "spread": (420, 110), "count": 80, "r_max": 6.5, "angle": -0.37, "smear": 22},
        ],
    },
    # A short dense slash, mid-right — the mark the draft places in the contact
    # band, where a full-width sweep would be too heavy.
    "streak-diag": {
        "colour": INK_LIGHT,
        "fibre_angle": 44,
        "fibre_squeeze": 24,
        "dry": 0.42,
        "dry_span": 0.24,
        "bloom": 0.3,
        "bloom_radius": 20,
        "strokes": [
            {"from": (1600, 810), "to": (1060, 280), "half": 124, "bow": 30, "taper": 0.72, "bias": 0.1, "jitter": 0.8},
        ],
        "tendrils": [
            {"from": (1520, 850), "to": (1180, 470), "half": 30, "bow": -24, "jitter": 1.0},
            {"from": (1660, 720), "to": (1310, 350), "half": 44, "bow": 20, "jitter": 0.9},
            {"from": (1340, 620), "to": (1020, 400), "half": 18, "bow": -16, "jitter": 1.15},
        ],
        "splatter": [
            {"at": (1280, 560), "spread": (230, 200), "count": 70, "r_max": 6, "angle": 0.8, "smear": 20},
        ],
    },
}

SEEDS = {
    "wash-hero": 20260913,
    "wash-band": 71007,
    "streak-corner": 4242,
    "streak-diag": 917,
}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--preview", action="store_true", help="also write PNG previews")
    args = parser.parse_args()

    os.makedirs(OUT_DIR, exist_ok=True)

    for name, spec in ASSETS.items():
        image = render(spec, SEEDS[name])
        path = os.path.join(OUT_DIR, f"{name}.webp")
        image.save(path, "WEBP", quality=74, method=6)
        size = os.path.getsize(path) / 1024
        print(f"{name}.webp  {size:6.1f} KB")

        if args.preview:
            image.save(os.path.join("/tmp", f"{name}.png"))


if __name__ == "__main__":
    main()
