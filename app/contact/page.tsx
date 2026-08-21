import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader/PageHeader";
import ContactForm from "@/components/ContactForm/ContactForm";
import SocialBar from "@/components/SocialBar/SocialBar";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

const CONTACT_EMAIL = "management@amjunlimited.com";

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let’s Chat"
        subtitle="Below you will find all our contact information — please do not hesitate to contact us."
      />
      <section className="section">
        <div className="u-container contact">
          <div className="contact__info">
            <div className="contact__item">
              <h3 className="contact__label">Phone</h3>
              <a className="contact__value" href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}>
                928-750-8492
              </a>
            </div>
            <div className="contact__item">
              <h3 className="contact__label">Email</h3>
              <a className="contact__value" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className="contact__item">
              <h3 className="contact__label">Location</h3>
              <address className="contact__value contact__value--address">
                {site.address.street}
                <br />
                {site.address.city}, {site.address.region} {site.address.postalCode}
              </address>
            </div>
            <div className="contact__item">
              <h3 className="contact__label">Social Media</h3>
              <SocialBar modifier="social-bar--light" />
            </div>
          </div>

          <div className="contact__form">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
