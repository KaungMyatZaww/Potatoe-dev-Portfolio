import "./inkSurface.scss";

/**
 * The wash layer for one section — paper grain, a sumi wash, a vignette.
 *
 * Washes are pre-rendered textures rather than vector paths or CSS gradients.
 * A brush stroke that is even slightly wrong reads as a plastic blob, and a
 * tapered path with a turbulence filter (the previous approach) cannot produce
 * the dry-brush fibres, torn edges and pigment granulation the reference is
 * made of. Rendering them once at build time costs a handful of KB each and
 * buys real ink.
 *
 * See tools/generate-ink-textures.py.
 */

const WASHES = {
  // Sumi pooled into the bottom right — the hero's dominant mass.
  hero: "/textures/wash-hero.webp",
  // The same language from the opposite corner, for the facing paper section.
  band: "/textures/wash-band.webp",
  // A broad drag of pale graphite on the dark ground.
  corner: "/textures/streak-corner.webp",
  // A short dense slash, for where a full sweep would be too heavy.
  slash: "/textures/streak-diag.webp",
};

export default function InkSurface({ wash, priority = false }) {
  return (
    <div className="ink-surface" aria-hidden="true">
      <span className="ink-surface__grain" />

      {wash && WASHES[wash] ? (
        <img
          className="ink-surface__wash"
          src={WASHES[wash]}
          alt=""
          width="1440"
          height="900"
          // Only the hero's wash is above the fold; the rest defer until the
          // reader is close to them.
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      ) : null}

      <span className="ink-surface__vignette" />
    </div>
  );
}
