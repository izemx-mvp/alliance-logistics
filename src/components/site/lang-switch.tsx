import { LANGS, useLang, useSetLang, useT } from "@/i18n";
import { cn } from "@/lib/utils";

/** FR / EN toggle. Keeps the current page and persists the choice. */
export function LangSwitch({ className, dark = false }: { className?: string; dark?: boolean }) {
  const lang = useLang();
  const setLang = useSetLang();
  const t = useT();

  return (
    <div
      role="group"
      aria-label={t.lang.switchAria}
      className={cn(
        "inline-flex items-center rounded-full border p-0.5 text-xs font-semibold",
        dark ? "border-white/20" : "border-border",
        className,
      )}
    >
      {LANGS.map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={active}
            aria-label={t.lang[code]}
            onClick={() => !active && setLang(code)}
            className={cn(
              "min-w-9 rounded-full px-2.5 py-1.5 uppercase tracking-wider transition-colors",
              active
                ? "bg-charcoal text-white"
                : dark
                  ? "text-white/70 hover:text-white"
                  : "text-muted-foreground hover:text-foreground",
            )}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
