import Link from "next/link";
import Image from "next/image";
import { mainNav, site } from "@/lib/site";
import { asset } from "@/lib/asset";

export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <Link href="/" className="header__brand" aria-label={`${site.name} home`}>
          {/* next/image applies the GitHub Pages basePath (/AMJU) to the src. */}
          <Image
            className="header__logo"
            src={asset("/images/brand/amju-logo.png")}
            alt={site.name}
            width={83}
            height={52}
            priority
          />
        </Link>

        <nav className="header__nav" aria-label="Primary">
          <ul className="header__menu">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="header__link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <Link href="/members" className="header__icon-link" aria-label="My Account">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <circle cx="12" cy="8" r="3.4" />
              <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
            </svg>
          </Link>
          <Link href="/shop" className="header__icon-link" aria-label="Cart">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <path d="M4 5h2l1.6 9.5A2 2 0 0 0 9.6 16h7a2 2 0 0 0 2-1.6L20 8H6.2" />
              <circle cx="10" cy="20" r="1.3" />
              <circle cx="17" cy="20" r="1.3" />
            </svg>
          </Link>
          <button
            className="header__toggle btn btn--ghost btn--sm"
            aria-label="Open menu"
          >
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}
