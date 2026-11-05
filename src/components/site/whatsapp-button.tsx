import { site } from "@/config/site";
import { useT } from "@/i18n";

/**
 * Floating WhatsApp contact button. The number is a placeholder —
 * see src/config/site.ts (site.whatsapp).
 */
export function WhatsAppButton() {
  const t = useT();
  const href = `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(t.whatsapp.message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={t.whatsapp.aria}
      title={
        site.whatsapp.placeholder
          ? `${t.whatsapp.placeholderTitle} (${site.whatsapp.display})`
          : `WhatsApp ${site.whatsapp.display}`
      }
      className="group fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-lg shadow-black/20 transition-transform hover:scale-105 motion-reduce:hover:scale-100"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-whatsapp opacity-40 motion-safe:animate-ping [animation-duration:2.8s]"
      />
      <svg viewBox="0 0 24 24" className="relative size-7" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.14-1.35A10 10 0 1 0 12 2Zm0 2a8 8 0 1 1-4.1 14.87l-.3-.18-2.23.59.6-2.18-.19-.31A8 8 0 0 1 12 4Zm-3.1 4.2c-.15 0-.4.06-.6.28-.2.22-.77.75-.77 1.83 0 1.08.79 2.12.9 2.27.11.14 1.55 2.36 3.75 3.31 1.85.8 2.22.64 2.62.6.4-.03 1.29-.53 1.47-1.04.18-.51.18-.95.13-1.04-.05-.1-.2-.15-.41-.26-.21-.11-1.29-.63-1.49-.7-.2-.08-.35-.11-.5.11-.14.21-.56.7-.68.85-.13.14-.25.16-.46.05-.21-.1-.9-.33-1.71-1.05-.63-.56-1.06-1.26-1.18-1.47-.13-.21-.01-.32.09-.43.1-.1.21-.26.32-.39.1-.13.14-.22.21-.36.07-.15.04-.28-.02-.39-.06-.11-.5-1.2-.68-1.64-.18-.44-.36-.4-.5-.4h-.49Z" />
      </svg>
    </a>
  );
}
