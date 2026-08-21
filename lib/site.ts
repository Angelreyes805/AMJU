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
    street: "1322 S 4th Ave",
    city: "Yuma",
    region: "Az",
    postalCode: "85364",
    country: "United States",
  },
} as const;

// Primary navigation — matches the live site's menu order.
export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Videos", href: "/livestream" },
  { label: "Forum", href: "/forum" },
  { label: "Members", href: "/members" },
  { label: "Blog", href: "/blog" },
] as const;

// Store hours as displayed on the live site (reproduced verbatim).
export const storeHours = [
  { day: "Sunday", hours: "12:00am - 8:00pm" },
  { day: "Monday", hours: "Closed" },
  { day: "Tuesday", hours: "Closed" },
  { day: "Wednesday", hours: "12:00am - 8:00pm" },
  { day: "Thursday", hours: "12:00am - 8:00pm" },
  { day: "Friday", hours: "12:00am - 8:00pm" },
  { day: "Saturday", hours: "12:00am - 8:00pm" },
] as const;

// "Information" links block from the live site.
export const informationLinks = [
  { label: "Shipping/Handling & Return Policy", href: "/shipping-returns" },
  { label: "Cookies/Privacy Notice", href: "/privacy-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Contact information", href: "/contact" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Terms of Use", href: "/terms-of-use" },
] as const;

// Social bar — real profiles linked on the live site.
export const socials = [
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=100075643251135" },
  { label: "Instagram", href: "https://www.instagram.com/amjunlimited/?hl=en" },
  { label: "TikTok", href: "https://www.tiktok.com/@amj_unlimited" },
  { label: "Twitch", href: "https://www.twitch.tv/enigma_anthony" },
  { label: "Twitter", href: "https://twitter.com/AmjUnlimited" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCC6Kw4zdwPVgprugOFSvocw" },
] as const;
