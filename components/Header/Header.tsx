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
          <Link href="/shop" className="btn btn--accent btn--sm">
            Shop Now
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
