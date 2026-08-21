import Link from "next/link";
import SocialBar from "@/components/SocialBar/SocialBar";
import { informationLinks, site, storeHours } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          {/* Location */}
          <div className="footer__col">
            <h3 className="footer__col-title">Location</h3>
            <address className="footer__address">
              {site.address.street}
              <br />
              {site.address.city}, {site.address.region} {site.address.postalCode}
              <br />
              {site.address.country}
              <br />
              <a href={`tel:${site.phone.replace(/[^\d+]/g, "")}`} className="footer__link">
                {site.phone}
              </a>
            </address>
          </div>

          {/* Store Hours */}
          <div className="footer__col">
            <h3 className="footer__col-title">Store Hours:</h3>
            <ul className="footer__hours">
              {storeHours.map((row) => (
                <li key={row.day} className="footer__hours-row">
                  <span>{row.day}</span>
                  <span>{row.hours}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div className="footer__col">
            <h3 className="footer__col-title">Information</h3>
            <div className="footer__links">
              {informationLinks.map((link) => (
                <Link key={link.label} href={link.href} className="footer__link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div className="footer__col">
            <h3 className="footer__col-title">Socials</h3>
            <SocialBar modifier="social-bar--footer" />
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
