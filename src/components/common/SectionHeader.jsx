import useReveal from "../../hooks/useReveal";
import "./sectionHeader.scss";

/**
 * Editorial chapter heading shared by every section.
 *
 * Renders the mono index + kicker rule, the display title, and an optional
 * vertical Japanese-style label for the manga/editorial composition.
 */
export default function SectionHeader({
  index,
  kicker,
  title,
  jp,
  align = "start",
  id,
}) {
  const [ref, isVisible] = useReveal({ threshold: 0.2 });

  return (
    <header
      ref={ref}
      className={`section-header section-header--${align} reveal ${
        isVisible ? "is-visible" : ""
      }`}
    >
      <div className="section-header__meta">
        {index && <span className="section-header__index">{index}</span>}
        <span className="section-header__rule" aria-hidden="true" />
        {kicker && <span className="section-header__kicker">{kicker}</span>}
      </div>

      <div className="section-header__body">
        <h2 className="section-header__title" id={id}>
          {title}
        </h2>
        {jp && (
          <span className="section-header__jp" lang="ja" aria-hidden="true">
            {jp}
          </span>
        )}
      </div>
    </header>
  );
}
