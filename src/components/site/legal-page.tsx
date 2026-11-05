import { PageHero } from "./page-hero";
import { SampleTag } from "./motif";
import { Container } from "./section";
import { useT } from "@/i18n";

export type LegalSection = { heading: string; paragraphs: string[] };

export function LegalPage({
  title,
  updated,
  sections,
  crumbLabel,
}: {
  title: string;
  updated: string;
  sections: LegalSection[];
  crumbLabel: string;
}) {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow={t.footer.company}
        title={title}
        intro={updated}
        crumbs={[{ label: t.nav.home, href: "/" }, { label: crumbLabel }]}
      />
      <section className="py-16 lg:py-20">
        <Container className="max-w-3xl">
          <SampleTag />
          {sections.map((s) => (
            <section key={s.heading} className="mt-10">
              <h2 className="font-display text-xl font-bold">{s.heading}</h2>
              {s.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="mt-3 leading-relaxed text-foreground/85">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </Container>
      </section>
    </>
  );
}
