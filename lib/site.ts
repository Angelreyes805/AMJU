// Central site configuration mirrored from amjunlimited.com.

export const site = {
  name: "AMJ Unlimited",
  legalName: "AMJ Unlimited LLC",
  domain: "https://www.amjunlimited.com",
  description:
    "$10.99 flat rate shipping on all orders. A wide variety of Gundam/Mecha models, collectibles, building blocks, supplies and more — there is something for everyone.",
  shippingBanner: "$10.99 FLAT RATE SHIPPING ON ALL ORDERS",
  phone: "+1 (928) 750-8492",
  address: {
    street: "1322 South 4th Avenue",
    city: "Yuma",
    region: "AZ",
    postalCode: "85364-4663",
    country: "US",
  },
} as const;

// Primary navigation — maps the live Wix pages to the rebuilt routes.
export const mainNav = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Livestream", href: "/livestream" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const footerNav = {
  Shop: [
    { label: "All Products", href: "/shop" },
    { label: "Gift Cards", href: "/gift-card" },
    { label: "Livestream", href: "/livestream" },
  ],
  Support: [
    { label: "Shipping & Returns", href: "/shipping-returns" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Use", href: "/terms-of-use" },
  ],
} as const;
