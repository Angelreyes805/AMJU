// Interior-page hero used across all content pages.

export default function PageHeader({
  title,
  eyebrow,
  subtitle,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
}) {
  return (
    <header className="page-header">
      <div className="u-container">
        {eyebrow && <p className="u-eyebrow page-header__eyebrow">{eyebrow}</p>}
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
    </header>
  );
}
