import Link from "next/link";
import { footerNav, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          <div className="footer__brand">
            <p className="u-eyebrow">{site.name}</p>
            <p className="footer__tagline">{site.description}</p>
            <p className="footer__tagline">
              {site.address.street}, {site.address.city},{" "}
              {site.address.region} {site.address.postalCode}
              <br />
              {site.phone}
            </p>
          </div>

          {Object.entries(footerNav).map(([title, links]) => (
            <div key={title} className="footer__col">
              <h3 className="footer__col-title">{title}</h3>
              <div className="footer__links">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="footer__link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </span>
          <span>Rebuilt with Next.js — a faithful recreation.</span>
        </div>
      </div>
    </footer>
  );
}
