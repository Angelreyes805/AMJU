import { socials } from "@/lib/site";

// Minimal inline icon paths keyed by platform label.
const ICONS: Record<string, React.ReactNode> = {
  Facebook: <path d="M13.5 9H15V6.5h-1.5c-1.9 0-3 1.2-3 3V11H9v2.5h1.5V20H13v-6.5h1.8l.4-2.5H13V9.6c0-.4.2-.6.5-.6Z" />,
  Instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.4" cy="7.6" r="1.1" />
    </>
  ),
  TikTok: <path d="M14 4c.3 2 1.6 3.4 3.6 3.6v2.3c-1.2 0-2.4-.4-3.4-1v4.8a4.7 4.7 0 1 1-4.7-4.7c.3 0 .5 0 .8.1v2.4a2.4 2.4 0 1 0 1.6 2.2V4H14Z" />,
  Twitch: <path d="M5 4 4 7v10h3v2h2l2-2h3l4-4V4H5Zm12 8-2 2h-3l-2 2v-2H7V6h10v6Zm-3-4h1.6v3H14V8Zm-3.5 0H12v3h-1.5V8Z" />,
  Twitter: <path d="M19 6.3c-.5.3-1.1.5-1.7.6.6-.4 1-.9 1.3-1.6-.6.3-1.2.6-1.9.7A2.9 2.9 0 0 0 11.8 8c0 .2 0 .5.1.7A8.2 8.2 0 0 1 6 5.6a2.9 2.9 0 0 0 .9 3.9c-.5 0-.9-.1-1.3-.3A2.9 2.9 0 0 0 8 12c-.4.1-.8.1-1.2.1a2.9 2.9 0 0 0 2.7 2A5.8 5.8 0 0 1 5 15.4 8.2 8.2 0 0 0 9.5 17c5.3 0 8.2-4.4 8.2-8.2v-.4c.6-.4 1-.9 1.3-1.5Z" />,
  YouTube: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.3v5.4l4.5-2.7-4.5-2.7Z" />
    </>
  ),
};

export default function SocialBar({ modifier = "" }: { modifier?: string }) {
  return (
    <ul className={`social-bar ${modifier}`.trim()}>
      {socials.map((s) => (
        <li key={s.label}>
          <a
            className="social-bar__link"
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
              {ICONS[s.label]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
