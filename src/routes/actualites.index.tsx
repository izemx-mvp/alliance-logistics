import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock, LayoutGrid } from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CATEGORY_ICON } from "@/components/site/category-icon";
import { PostCard } from "@/components/site/cards";
import { CtaBand } from "@/components/site/cta-band";
import { CornerBrackets, CrossroadsMotif, SampleTag } from "@/components/site/motif";
import { Container } from "@/components/site/section";
import { SiteImage } from "@/components/site/site-image";
import { formatDate } from "@/components/site/tracking-timeline";
import { POST_CATEGORIES, postText, sortedPosts, type Post, type PostCategory } from "@/data/posts";
import { getDictionary, intlLocale, langFromSearch, useLang, useT } from "@/i18n";
import { breadcrumbLd, pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/actualites/")({
  head: ({ match }) => {
    const lang = langFromSearch(match.search);
    const t = getDictionary(lang);
    return pageHead({
      lang,
      path: "/actualites",
      title: t.news.seoTitle,
      description: t.news.seoDescription,
      jsonLd: [
        breadcrumbLd(
          [
            { name: t.nav.home, path: "/" },
            { name: t.nav.news, path: "/actualites" },
          ],
          lang,
        ),
      ],
    });
  },
  component: NewsPage,
});


/* ================================================================== */

function NewsHero({ onPick }: { onPick: (c: PostCategory) => void }) {
  const t = useT();
  const all = sortedPosts();
  return (
    <section className="relative isolate overflow-hidden bg-charcoal text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
        <div className="animate-kenburns h-full w-full">
          <SiteImage image="actualitesHero" priority decorative sizes="100vw" className="h-full w-full" />
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/30" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-charcoal to-transparent" />
      <CrossroadsMotif className="absolute -left-24 bottom-0 -z-10 h-[26rem] w-[26rem] text-white/[0.05]" />
      <div className="mx-auto grid max-w-7xl items-end gap-10 px-4 pb-20 pt-32 sm:px-6 sm:pt-36 lg:grid-cols-[1.3fr_0.7fr] lg:px-8 lg:pb-24 lg:pt-44">
        <div className="hero-in">
          <Breadcrumbs items={[{ label: t.nav.home, href: "/" }, { label: t.nav.news }]} dark className="mb-6" />
          <p className="eyebrow text-white/80">{t.news.hero.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.04] text-balance sm:text-6xl xl:text-7xl">
            {t.news.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85">{t.news.hero.text}</p>
        </div>
        {/* topic index */}
        <ul className="hero-in hidden overflow-hidden rounded-2xl bg-charcoal/80 p-2 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)] ring-1 ring-white/15 lg:block">
          {POST_CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICON[c];
            const n = all.filter((p) => p.category === c).length;
            return (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => onPick(c)}
                  className="group flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm transition-colors hover:bg-white/10"
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-white/10 transition-colors group-hover:bg-primary">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                  <span className="flex-1 font-semibold">{t.news.categories[c]}</span>
                  <span className="font-mono text-xs text-white/50">{String(n).padStart(2, "0")}</span>
                  <ArrowRight aria-hidden="true" className="size-4 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function FeaturedPost({ post }: { post: Post }) {
  const t = useT();
  const lang = useLang();
  const text = postText(post, lang);
  const Icon = CATEGORY_ICON[post.category];
  return (
    <article className="group relative grid overflow-hidden rounded-3xl bg-charcoal text-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] lg:grid-cols-[1.25fr_1fr]">
      <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[26rem]">
        <SiteImage
          image={post.image}
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-105 motion-reduce:transform-none"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-charcoal" />
        <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
          <span className="size-1.5 rounded-full bg-white" />
          {t.news.featured}
        </span>
      </div>
      <div className="relative flex flex-col p-7 sm:p-10">
        <CrossroadsMotif className="absolute -bottom-16 -right-16 h-64 w-64 text-white/[0.04]" />
        <p className="flex flex-wrap items-center gap-3 text-xs text-white/60">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 font-semibold text-white">
            <Icon aria-hidden="true" className="size-3.5 text-primary" />
            {t.news.categories[post.category]}
          </span>
          <time dateTime={post.date}>{formatDate(post.date, intlLocale(lang))}</time>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden="true" className="size-3.5" />
            {t.common.minutes(post.readingMinutes)}
          </span>
        </p>
        <h2 className="mt-5 font-display text-2xl font-bold leading-tight text-balance sm:text-4xl">
          <Link
            to="/actualites/$slug"
            params={{ slug: post.slug }}
            className="before:absolute before:inset-0 before:z-10 before:content-[''] focus-visible:outline-none focus-visible:before:rounded-3xl focus-visible:before:ring-2 focus-visible:before:ring-primary"
          >
            {text.title}
          </Link>
        </h2>
        <p className="mt-4 leading-relaxed text-white/75 sm:text-lg">{text.excerpt}</p>
        <ul className="mt-6 hidden space-y-1.5 text-sm text-white/60 sm:block">
          {text.sections.slice(0, 3).map((s, i) => (
            <li key={s.id} className="flex gap-3">
              <span className="font-mono text-xs text-primary">0{i + 1}</span>
              {s.heading}
            </li>
          ))}
        </ul>
        <span aria-hidden="true" className="mt-auto inline-flex items-center gap-4 pt-8 font-semibold">
          <span className="grid size-10 place-items-center rounded-full bg-primary transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transform-none">
            <ArrowRight className="size-4" />
          </span>
          {t.common.readArticle}
        </span>
      </div>
    </article>
  );
}

function NewsPage() {
  const t = useT();
  const reduced = useReducedMotion();
  const [category, setCategory] = useState<PostCategory | "all">("all");
  const all = sortedPosts();
  const posts = all.filter((p) => category === "all" || p.category === category);
  const [featured, ...rest] = posts;

  const tabs = [
    { id: "all" as const, label: t.news.all, Icon: LayoutGrid, count: all.length },
    ...POST_CATEGORIES.map((c) => ({
      id: c,
      label: t.news.categories[c],
      Icon: CATEGORY_ICON[c],
      count: all.filter((p) => p.category === c).length,
    })),
  ];

  return (
    <>
      <NewsHero
        onPick={(c) => {
          setCategory(c);
          document.getElementById("news-list")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
        }}
      />

      {/* sticky filter bar */}
      <div className="sticky top-20 z-30 border-b border-border bg-white/85 backdrop-blur-lg">
        <Container className="flex items-center justify-between gap-4 py-3">
          <div role="group" aria-label={t.news.filterLabel} className="-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {tabs.map(({ id, label, Icon, count }) => {
              const active = category === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(id)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                    active
                      ? "border-charcoal bg-charcoal text-white"
                      : "border-border bg-white text-foreground/80 hover:border-charcoal hover:text-foreground",
                  )}
                >
                  <Icon aria-hidden="true" className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} />
                  {label}
                  <span className={cn("font-mono text-[0.7rem]", active ? "text-white/60" : "text-muted-foreground")}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <SampleTag className="hidden shrink-0 md:inline-flex" />
        </Container>
      </div>

      <section id="news-list" className="scroll-mt-36 py-14 lg:py-20">
        <Container>
          <div aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={category}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {!featured ? (
                  <div className="group relative rounded-2xl bg-secondary p-12 text-center text-muted-foreground">
                    <CornerBrackets className="absolute inset-3" />
                    {t.news.empty}
                  </div>
                ) : (
                  <>
                    <FeaturedPost post={featured} />
                    {rest.length > 0 && (
                      <>
                        <div className="mt-16 flex items-end justify-between gap-4 border-b border-border pb-4">
                          <h2 className="font-display text-2xl font-bold sm:text-3xl">{t.news.latest}</h2>
                          <p className="font-mono text-xs text-muted-foreground">{t.news.articles(posts.length)}</p>
                        </div>
                        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {rest.map((post) => (
                            <li key={post.slug}>
                              <PostCard post={post} />
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}