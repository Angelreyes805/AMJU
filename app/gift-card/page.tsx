import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader/PageHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "eGift Card" };

const AMOUNTS = [25, 50, 100, 150];

export default function GiftCardPage() {
  return (
    <>
      <PageHeader eyebrow="Gift Cards" title="eGift Card" />
      <section className="section">
        <div className="u-container gift-card">
          <div className="gift-card__preview" aria-hidden="true">
            <span className="gift-card__brand">{site.name}</span>
            <span className="gift-card__label">eGift Card</span>
          </div>

          <div className="gift-card__details">
            <p className="gift-card__price">$25.00</p>
            <p className="gift-card__text">
              Give the gift of building. Our eGift Cards are delivered by email
              and can be used on any order — Gundam/Mecha models, collectibles,
              supplies and more.
            </p>

            <div className="gift-card__amounts">
              {AMOUNTS.map((amt, i) => (
                <button
                  key={amt}
                  className={`btn ${i === 0 ? "btn--primary" : "btn--outline"} btn--sm`}
                  type="button"
                >
                  ${amt}
                </button>
              ))}
            </div>

            <button className="btn btn--accent btn--lg" type="button" disabled>
              Add to Cart
            </button>
            <p className="gift-card__note">
              Checkout is enabled once the store’s commerce API is connected.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
