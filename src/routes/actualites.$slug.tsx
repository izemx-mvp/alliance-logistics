import { useEffect, useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Facebook,
  Link2,
  Linkedin,
  MessageCircle,
  MessagesSquare,
} from "lucide-react";
import logoAsset from "@/assets/alliance-logistics-logo.png";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/site/cards";
import { CtaBand } from "@/components/site/cta-band";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { CATEGORY_ICON } from "@/components/site/category-icon";
import { CornerBrackets, CrossroadsMotif, SampleTag } from "@/components/site/motif";
import { Reveal } from "@/components/site/reveal";
import { Container } from "@/components/site/section";
import { SiteImage } from "@/components/site/site-image";
import { formatDate } from "@/components/site/tracking-timeline";
import { site } from "@/config/site";
import { getPost, postText, relatedPosts, sortedPosts, type Post } from "@/data/posts";
import { getDictionary, intlLocale, langFromSearch, useLang, useT } from "@/i18n";
import { images } from "@/lib/images";
import { absoluteUrl, blogPostingLd, breadcrumbLd, pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/actualites/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ match, params }) => {
    const lang = langFromSearch(match.search);
    const t = getDictionary(lang);
    const post = getPost(params.slug);
    if (!post)
      return { meta: [{ title: t.notFound.seoTitle }, { name: "robots", content: "noindex" }] };
    const text = postText(post, lang);
    const path = `/actualites/${post.slug}`;
    return pageHead({
      lang,
      path,
      type: "article",
      title: `${text.title} | Alliance Logistics`,
      description: text.excerpt,
      article: { publishedTime: post.date, section: t.news.categories[post.category] },
      jsonLd: [
        blogPostingLd({
          title: text.title,
          description: text.excerpt,
          path,
          lang,
          datePublished: post.date,
          image: images[post.image].src,
        }),
        breadcrumbLd(
          [
            { name: t.nav.home, path: "/" },
            { name: t.nav.news, path: "/actualites" },
            { name: text.title, path },
          ],
          lang,
        ),
      ],
    });
  },
  component: ArticlePage,
});

/* ================================================================== */

function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-20 z-40 h-1 origin-left bg-primary"
      style={{ scaleX }}
    />
  );
}

function ShareButtons({ url, title, vertical = false }: { url: string; title: string; vertical?: boolean }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const enc = encodeURIComponent;
  const links = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, Icon: Linkedin },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, Icon: Facebook },
    { label: "WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}`, Icon: MessageCircle },
  ];
  const btn =
    "inline-flex size-10 items-center justify-center rounded-full border border-border bg-white transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white motion-reduce:hover:translate-y-0";

  return (
    <div className={cn(vertical && "flex flex-col items-center")}>
      <p className={cn("text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground", vertical && "[writing-mode:vertical-rl] rotate-180 mb-3")}>
        {t.news.share}
      </p>
      <ul className={cn("flex gap-2", vertical ? "flex-col" : "mt-3 flex-wrap")}>
        {links.map(({ label, href, Icon }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noreferrer" className={btn} aria-label={`${t.news.share} — ${label}`}>
              <Icon aria-hidden="true" className="size-4" />
            </a>
          </li>
        ))}
        <li>
          <button
            type="button"
            className={btn}
            aria-label={copied ? t.news.copied : t.news.copyLink}
            onClick={() => {
              void navigator.clipboard?.writeText(url).then(() => setCopied(true));
            }}
          >
            {copied ? <Check aria-hidden="true" className="size-4" /> : <Link2 aria-hidden="true" className="size-4" />}
          </button>
        </li>
      </ul>
      <p aria-live="polite" className={cn("mt-2 h-4 text-xs text-primary", vertical && "sr-only")}>
        {copied ? t.news.copied : ""}
      </p>
    </div>
  );
}

function ArticleHero({ post }: { post: Post }) {
  const t = useT();
  const lang = useLang();
  const text = postText(post, lang);
  const Icon = CATEGORY_ICON[post.category];
  return (
    <header className="relative isolate overflow-hidden bg-charcoal text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden">
        <div className="animate-kenburns h-full w-full">
          <SiteImage image={post.image} priority sizes="100vw" className="h-full w-full" />
        </div>
      </div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/75 to-charcoal/35" />
      <CrossroadsMotif className="absolute -right-24 -top-24 -z-10 h-96 w-96 text-white/[0.05]" />

      <Container className="max-w-5xl pb-16 pt-36 sm:pb-20 lg:pb-24 lg:pt-48">
        <Breadcrumbs
          items={[
            { label: t.nav.home, href: "/" },
            { label: t.nav.news, href: "/actualites" },
            { label: text.title },
          ]}
          dark
          className="hero-in [&_li:last-child]:max-w-[16rem] [&_li:last-child]:truncate"
        />
        <div className="hero-in mt-8 flex flex-wrap items-center gap-3 text-sm text-white/75">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            <Icon aria-hidden="true" className="size-3.5" />
            {t.news.categories[post.category]}
          </span>
          <span>
            {t.news.published} <time dateTime={post.date}>{formatDate(post.date, intlLocale(lang))}</time>
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden="true" className="size-3.5" />
            {t.common.minutes(post.readingMinutes)}
          </span>
          <SampleTag className="border-white/40 text-white/70" />
        </div>
        <h1 className="hero-in mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.08] text-balance sm:text-5xl lg:text-6xl">
          {text.title}
        </h1>
        <p className="hero-in mt-6 max-w-2xl border-l-2 border-primary pl-5 text-lg leading-relaxed text-white/85 sm:text-xl">
          {text.excerpt}
        </p>
      </Container>
    </header>
  );
}

function Toc({ post, activeId }: { post: Post; activeId: string | null }) {
  const t = useT();
  const lang = useLang();
  const sections = postText(post, lang).sections;
  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === activeId));
  return (
    <nav aria-label={t.news.toc}>
      <p className="eyebrow text-primary">{t.news.toc}</p>
      <ol className="relative mt-5 space-y-1">
        <span aria-hidden="true" className="absolute bottom-2 left-[11px] top-2 w-px bg-border" />
        <span
          aria-hidden="true"
          className="absolute left-[11px] top-2 w-px bg-primary transition-all duration-500"
          style={{ height: `calc(${((activeIndex + 0.5) / sections.length) * 100}% - 0.5rem)` }}
        />
        {sections.map((s, i) => {
          const active = activeId === s.id;
          const passed = i < activeIndex;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "group relative flex gap-3 rounded-lg py-1.5 pr-2 text-sm transition-colors",
                  active ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "relative z-10 grid size-6 shrink-0 place-items-center rounded-full font-mono text-[0.65rem] font-bold transition-colors",
                    active ? "bg-primary text-white" : passed ? "bg-charcoal text-white" : "bg-secondary text-muted-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <span className="pt-0.5">{s.heading}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Body({ post }: { post: Post }) {
  const lang = useLang();
  const text = postText(post, lang);
  return (
    <div className="max-w-[44rem]">
      {text.sections.map((s, si) => (
        <Reveal as="section" key={s.id} className="mb-14 last:mb-0">
          <h2 id={s.id} className="flex scroll-mt-32 items-baseline gap-4 font-display text-2xl font-bold leading-tight sm:text-3xl">
            <span aria-hidden="true" className="font-mono text-sm font-bold text-primary">
              {String(si + 1).padStart(2, "0")}
            </span>
            {s.heading}
          </h2>
          {s.paragraphs.map((p, pi) => (
            <p
              key={p.slice(0, 32)}
              className={cn(
                "mt-5 text-lg leading-[1.8] text-foreground/85",
                si === 0 &&
                  pi === 0 &&
                  "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-primary",
              )}
            >
              {p}
            </p>
          ))}
          {s.list && (
            <ul className="mt-6 space-y-2.5 rounded-2xl bg-secondary p-5 sm:p-6">
              {s.list.map((li) => {
                const [head, ...tail] = li.split(" : ");
                return (
                  <li key={li} className="flex gap-3 leading-relaxed text-foreground/85">
                    <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-primary text-white">
                      <Check aria-hidden="true" className="size-3" />
                    </span>
                    <span>
                      {tail.length > 0 ? (
                        <>
                          <strong className="font-semibold text-foreground">{head}</strong> : {tail.join(" : ")}
                        </>
                      ) : (
                        li
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Reveal>
      ))}
    </div>
  );
}

function AfterArticle({ post }: { post: Post }) {
  const t = useT();
  const lang = useLang();
  const all = sortedPosts();
  const idx = all.findIndex((p) => p.slug === post.slug);
  const older = all[idx + 1];
  const newer = all[idx - 1];

  return (
    <div className="mt-16 max-w-[44rem] space-y-6">
      {/* author */}
      <Reveal className="flex items-center gap-5 border-y border-border py-6">
        <span className="grid h-16 w-28 shrink-0 place-items-center rounded-2xl bg-white px-3 shadow-card ring-1 ring-border">
          <img src={logoAsset} alt="" width={284} height={100} className="h-auto w-full" />
        </span>
        <div>
          <p className="font-display font-semibold">{t.news.author}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.news.authorText}</p>
        </div>
      </Reveal>

      {/* expert CTA */}
      <Reveal className="group relative overflow-hidden rounded-2xl bg-charcoal p-7 text-white sm:p-8">
        <CornerBrackets tone="light" className="absolute inset-3" />
        <CrossroadsMotif className="absolute -bottom-12 -right-12 h-48 w-48 text-white/[0.05]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary">
              <MessagesSquare aria-hidden="true" className="size-6" />
            </span>
            <div>
              <p className="font-display text-xl font-bold">{t.news.expertTitle}</p>
              <p className="mt-1 text-sm text-white/70">{t.news.expertText}</p>
            </div>
          </div>
          <Button asChild className="shrink-0">
            <Link to="/contact">
              {t.news.expertCta} <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </Reveal>

      {/* prev / next */}
      <nav aria-label={t.news.backToList} className="grid gap-4 sm:grid-cols-2">
        {older ? (
          <Link
            to="/actualites/$slug"
            params={{ slug: older.slug }}
            className="group rounded-2xl border border-border p-5 transition-colors hover:border-primary"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <ArrowLeft aria-hidden="true" className="size-3.5 transition-transform group-hover:-translate-x-1" />
              {t.news.prev}
            </span>
            <span className="mt-2 block font-display font-semibold leading-snug">{postText(older, lang).title}</span>
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link
            to="/actualites/$slug"
            params={{ slug: newer.slug }}
            className="group rounded-2xl border border-border p-5 text-right transition-colors hover:border-primary"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {t.news.next}
              <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="mt-2 block font-display font-semibold leading-snug">{postText(newer, lang).title}</span>
          </Link>
        )}
      </nav>

      <Link to="/actualites" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft aria-hidden="true" className="size-4" /> {t.news.backToList}
      </Link>
    </div>
  );
}

/* ================================================================== */

function ArticlePage() {
  const post = Route.useLoaderData();
  const t = useT();
  const lang = useLang();
  const text = postText(post, lang);
  const related = relatedPosts(post);
  const url = absoluteUrl(`/actualites/${post.slug}`, lang);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Highlight the current TOC entry.
  useEffect(() => {
    const els = text.sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -60% 0px" },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [text.sections]);

  return (
    <>
      <ReadingProgress />
      <article>
        <ArticleHero post={post} />

        <Container className="grid gap-12 py-16 lg:grid-cols-[240px_minmax(0,1fr)_48px] lg:gap-16 lg:py-24">
          <aside className="hidden lg:sticky lg:top-32 lg:block lg:self-start">
            <Toc post={post} activeId={activeId} />
          </aside>

          <div>
            {/* mobile TOC */}
            <details className="group mb-10 rounded-2xl bg-secondary p-5 lg:hidden">
              <summary className="cursor-pointer list-none font-display font-semibold">
                <span className="eyebrow text-primary">{t.news.toc}</span>
              </summary>
              <ol className="mt-4 space-y-2 text-sm">
                {text.sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="flex gap-3 text-muted-foreground hover:text-foreground">
                      <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </details>

            <Body post={post} />
            <div className="mt-12 lg:hidden">
              <ShareButtons url={url} title={text.title} />
            </div>
            <AfterArticle post={post} />
          </div>

          <aside className="hidden lg:sticky lg:top-32 lg:block lg:self-start">
            <ShareButtons url={url} title={text.title} vertical />
          </aside>
        </Container>
      </article>

      <section className="relative isolate overflow-hidden bg-secondary py-16 lg:py-24">
        <CrossroadsMotif className="absolute -left-24 top-10 -z-10 h-96 w-96 motif-faint" />
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-primary">{site.name}</p>
              <h2 className="mt-3 font-display text-3xl font-bold">{t.news.related}</h2>
            </div>
            <Link
              to="/actualites"
              className="hidden items-center gap-2 text-sm font-semibold text-primary hover:underline sm:inline-flex"
            >
              {t.news.backToList} <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}