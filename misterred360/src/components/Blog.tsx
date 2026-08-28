import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock, UserRound } from "lucide-react";
import { type InsightBlock, type InsightPost } from "../lib/insights";
import { useInsights } from "../lib/useInsights";
import { useI18n } from "../lib/i18n";
import { SITE, usePageSeo } from "../lib/seo";
import { getSeo } from "../lib/data";
import { Kicker, Wordmark } from "./ui";

/* Helpers de SEO para el blog */
const MONTHS: Record<string, string> = {
  ene: "01", enero: "01", jan: "01", january: "01",
  feb: "02", febrero: "02", february: "02",
  mar: "03", marzo: "03", march: "03",
  abr: "04", abril: "04", apr: "04", april: "04",
  may: "05", mayo: "05",
  jun: "06", junio: "06", june: "06",
  jul: "07", julio: "07", july: "07",
  ago: "08", agosto: "08", aug: "08", august: "08",
  sep: "09", septiembre: "09", september: "09",
  oct: "10", octubre: "10", october: "10",
  nov: "11", noviembre: "11", november: "11",
  dic: "12", diciembre: "12", dec: "12", december: "12",
};
function toIsoDate(human: string): string {
  const parts = human.toLowerCase().replace(/,/g, "").split(/\s+/);
  if (parts.length >= 3) {
    const day = parts[0].padStart(2, "0");
    const month = MONTHS[parts[1]] ?? "01";
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return new Date().toISOString().slice(0, 10);
}
function estimateWordCount(blocks: InsightBlock[]): number {
  return blocks.reduce((sum, b) => {
    if ("text" in b) return sum + b.text.split(/\s+/).length;
    if ("items" in b) return sum + b.items.join(" ").split(/\s+/).length;
    return sum;
  }, 0);
}

function Rich({ text }: { text: string }) {
  const parts = text.split(/(\{red\}[^{]+\{\/red\})/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\{red\}(.+)\{\/red\}$/);
        return m ? <span key={i} className="text-brand">{m[1]}</span> : <span key={i}>{p}</span>;
      })}
    </>
  );
}

export type BlogRoute =
  | { type: "index" }
  | { type: "article"; slug: string };

interface BlogProps {
  route: BlogRoute;
  onBackHome: (href?: string) => void;
  onOpenIndex: () => void;
  onOpenPost: (slug: string) => void;
}

export default function Blog({ route, onBackHome, onOpenIndex, onOpenPost }: BlogProps) {
  const { t, locale } = useI18n();
  const insightPosts = useInsights();
  const blogSeo = getSeo(locale, "insights");

  /* SEO enriquecido según la vista (índice o noticia individual) */
  const activePost =
    route.type === "article"
      ? insightPosts.find((p) => p.slug === route.slug)
      : null;

  const seoOpts =
    route.type === "index"
      ? {
          title: blogSeo.title,
          description: blogSeo.description,
          path: "/insights",
          ogImage: `${SITE}${insightPosts[0]?.image ?? "/images/chimp-hero.jpg"}`,
          breadcrumbs: [
            { name: "Inicio", path: "/" },
            { name: t("page.blog.kicker"), path: "/insights" },
          ],
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${SITE}/insights#blog`,
            name: blogSeo.title,
            description: blogSeo.description,
            url: `${SITE}/insights`,
            inLanguage: "es-ES",
            publisher: { "@id": `${SITE}/#organizacion` },
            blogPost: insightPosts.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: `${SITE}/insights/${p.slug}`,
              image: `${SITE}${p.image}`,
              datePublished: toIsoDate(p.date),
              articleSection: p.category,
              author: { "@type": "Organization", name: "MISTERRED360" },
            })),
          },
        }
      : activePost
        ? {
            title: `${activePost.title} | Insights MISTERRED360`,
            description: activePost.excerpt,
            path: `/insights/${activePost.slug}`,
            ogImage: `${SITE}${activePost.image}`,
            ogType: "article" as const,
            breadcrumbs: [
              { name: "Inicio", path: "/" },
              { name: t("page.blog.kicker"), path: "/insights" },
              { name: activePost.title, path: `/insights/${activePost.slug}` },
            ],
            jsonLd: {
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "@id": `${SITE}/insights/${activePost.slug}#article`,
              headline: activePost.title,
              description: activePost.excerpt,
              image: `${SITE}${activePost.image}`,
              articleSection: activePost.category,
              keywords: activePost.tags.join(", "),
              datePublished: toIsoDate(activePost.date),
              dateModified: toIsoDate(activePost.date),
              wordCount: estimateWordCount(activePost.content),
              inLanguage: "es-ES",
              author: {
                "@type": "Organization",
                name: activePost.author,
                url: SITE,
              },
              publisher: { "@id": `${SITE}/#organizacion` },
              mainEntityOfPage: `${SITE}/insights/${activePost.slug}`,
            },
          }
        : {
            title: t("post.404.title"),
            description: blogSeo.description,
            path: `/insights/${route.type === "article" ? route.slug : ""}`,
            noindex: true,
          };

  usePageSeo(seoOpts);

  if (route.type === "article") {
    const post = insightPosts.find((item) => item.slug === route.slug);
    if (!post) {
      return (
        <main className="min-h-screen bg-paper text-ink pt-28 px-5 md:px-10">
          <div className="max-w-3xl mx-auto py-24">
            <Kicker index="404" dark>
              {t("post.404.kicker")}
            </Kicker>
            <h1 className="mt-8 font-display font-semibold text-5xl uppercase leading-none">
              {t("post.404.title")}
            </h1>
            <button
              onClick={onOpenIndex}
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-paper"
            >
              {t("post.404.button")}
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      );
    }
    return (
      <BlogArticle
        post={post}
        onBackHome={onBackHome}
        onOpenIndex={onOpenIndex}
        onOpenPost={onOpenPost}
      />
    );
  }

  return <BlogIndex onBackHome={onBackHome} onOpenPost={onOpenPost} />;
}

function BlogIndex({
  onBackHome,
  onOpenPost,
}: {
  onBackHome: (href?: string) => void;
  onOpenPost: (slug: string) => void;
}) {
  const { t } = useI18n();
  const insightPosts = useInsights();
  const featured = insightPosts[0];

  return (
    <main id="contenido-principal" className="bg-paper text-ink">
      <section className="relative min-h-[84svh] bg-ink text-paper overflow-hidden pt-28">
        <div className="absolute inset-0 glow-brand" aria-hidden="true" />
        <div className="absolute inset-0 glow-ocean" aria-hidden="true" />

        <div className="relative px-5 md:px-10 xl:px-16 py-16 md:py-24 max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <button
              onClick={() => onBackHome()}
              className="mb-10 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-smoke hover:text-paper transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("page.blog.back")}
            </button>
            <Kicker index="BLOG">{t("page.blog.kicker")}</Kicker>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-display font-semibold uppercase leading-[0.92] tracking-[-0.02em] text-[clamp(1.9rem,6.4vw,6.4rem)]"
            >
              {t("page.blog.title.a")}
              <br />
              {t("page.blog.title.b")}
              <br />
              <Rich text={t("page.blog.title.c")} />
            </motion.h1>
            <p className="mt-8 max-w-xl text-base md:text-lg leading-relaxed text-smoke">
              {t("page.blog.intro")}
            </p>
          </div>

          <motion.button
            onClick={() => onOpenPost(featured.slug)}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 group text-left"
            data-cursor="view"
          >
            <span className="block overflow-hidden rounded-[2rem] aspect-[4/5] border border-white/10">
              <img
                src={featured.image}
                alt={featured.imageAlt}
                className="w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </span>
            <span className="mt-5 flex items-center justify-between gap-4">
              <span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.24em] text-brand">
                  {t("page.blog.last")}
                </span>
                <span className="mt-2 block font-display font-semibold text-2xl leading-tight text-paper">
                  {featured.title}
                </span>
              </span>
              <span className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45" />
              </span>
            </span>
          </motion.button>
        </div>
      </section>

      <section className="px-5 md:px-10 xl:px-16 py-20 md:py-28 max-w-[1600px] mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <Kicker index="ALL" dark>
              {t("page.blog.all.kicker")}
            </Kicker>
            <h2 className="mt-8 font-display font-semibold uppercase leading-none text-[clamp(2.2rem,5vw,5rem)]">
              {t("page.blog.all.title")}
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base leading-relaxed text-ink/60">
            {t("page.blog.all.desc")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {insightPosts.map((post, i) => (
            <InsightTile key={post.slug} post={post} index={i} onOpenPost={onOpenPost} />
          ))}
        </div>
      </section>

      <BlogMiniFooter onBackHome={onBackHome} />
    </main>
  );
}

function BlogArticle({
  post,
  onBackHome,
  onOpenIndex,
  onOpenPost,
}: {
  post: InsightPost;
  onBackHome: (href?: string) => void;
  onOpenIndex: () => void;
  onOpenPost: (slug: string) => void;
}) {
  const { t } = useI18n();
  const insightPosts = useInsights();
  return (
    <main id="contenido-principal" className="bg-paper text-ink">
      <article>
        <header className="relative bg-ink text-paper pt-28 overflow-hidden">
          <div className="absolute inset-0 glow-brand" aria-hidden="true" />
          <div className="absolute inset-0 glow-ocean" aria-hidden="true" />
          <div className="relative px-5 md:px-10 xl:px-16 py-16 md:py-24 max-w-[1500px] mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
              <button
                onClick={onOpenIndex}
                className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-smoke hover:text-paper transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("post.back.index")}
              </button>
              <button
                onClick={() => onBackHome()}
                className="text-[11px] font-semibold uppercase tracking-[0.22em] text-smoke hover:text-paper transition-colors"
              >
                {t("post.back.home")}
              </button>
            </div>

            <div className="max-w-5xl">
              <Kicker index={post.category.toUpperCase()}>{t("post.kicker")}</Kicker>
              <h1 className="mt-6 font-display font-semibold uppercase leading-[0.96] tracking-[-0.02em] text-[clamp(1.9rem,7vw,7rem)]">
                {post.title}
              </h1>
              <p className="mt-8 max-w-3xl text-lg md:text-2xl leading-snug text-smoke">
                {post.excerpt}
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-smoke">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-brand" />
                  {post.date}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="w-4 h-4 text-brand" />
                  {post.readTime}
                </span>
                <span className="inline-flex items-center gap-2">
                  <UserRound className="w-4 h-4 text-brand" />
                  {post.author}
                </span>
              </div>
            </div>
          </div>

          <div className="relative px-5 md:px-10 xl:px-16 max-w-[1600px] mx-auto pb-10">
            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              className="aspect-[4/3] sm:aspect-[16/9] md:aspect-[16/7] rounded-[2rem] overflow-hidden border border-white/10"
            >
              <img
                src={post.image}
                alt={post.imageAlt}
                className="w-full h-full object-cover object-[center_22%]"
                fetchPriority="high"
              />
            </motion.div>
          </div>
        </header>

        <section className="px-5 md:px-10 xl:px-16 py-16 md:py-24 max-w-[1300px] mx-auto grid lg:grid-cols-[minmax(0,1fr)_320px] gap-12 lg:gap-20 items-start">
          <div className="max-w-[760px]">
            {post.content.map((block, i) => (
              <ArticleBlock key={`${block.type}-${i}`} block={block} />
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 space-y-6">
            <div className="rounded-[1.5rem] bg-white border border-ink/10 p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/45 mb-5">
                {t("post.card.title")}
              </p>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-ink/45">{t("post.card.author")}</dt>
                  <dd className="font-medium text-ink">{post.authorRole}</dd>
                </div>
                <div>
                  <dt className="text-ink/45">{t("post.card.category")}</dt>
                  <dd className="font-medium text-ink">{post.category}</dd>
                </div>
                <div>
                  <dt className="text-ink/45">{t("post.card.read")}</dt>
                  <dd className="font-medium text-ink">{post.readTime}</dd>
                </div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-ink text-paper px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-ink text-paper p-6">
              <p className="font-display font-semibold text-2xl leading-tight">
                {t("post.cta.title")}
              </p>
              <button
                onClick={() => onBackHome("/contacto")}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-flame transition-colors"
              >
                {t("post.cta.button")}
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </aside>
        </section>
      </article>

      <section className="px-5 md:px-10 xl:px-16 py-20 md:py-28 bg-ink text-paper">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <Kicker index="ARCHIVE">{t("post.related.kicker")}</Kicker>
              <h2 className="mt-8 font-display font-semibold uppercase leading-none text-[clamp(2rem,4.8vw,4.6rem)]">
                {t("post.related.title")}
              </h2>
            </div>
            <button
              onClick={onOpenIndex}
              className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.14em] hover:bg-paper hover:text-ink transition-colors"
            >
              {t("post.related.button")}
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {insightPosts.map((item, i) => (
              <DarkInsightTile key={item.slug} post={item} index={i} onOpenPost={onOpenPost} />
            ))}
          </div>
        </div>
      </section>

      <BlogMiniFooter onBackHome={onBackHome} />
    </main>
  );
}

function ArticleBlock({ block }: { block: InsightBlock }) {
  if (block.type === "heading") {
    return (
      <h2 className="mt-14 mb-5 font-display font-semibold text-3xl md:text-4xl leading-tight">
        {block.text}
      </h2>
    );
  }
  if (block.type === "quote") {
    return (
      <blockquote className="my-10 border-l-4 border-brand pl-6">
        <p className="font-quote italic text-2xl md:text-3xl leading-snug text-ink/82">
          “{block.text}”
        </p>
        {block.cite && (
          <cite className="mt-4 block not-italic text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/45">
            {block.cite}
          </cite>
        )}
      </blockquote>
    );
  }
  if (block.type === "list") {
    return (
      <ul className="my-8 space-y-4">
        {block.items.map((item) => (
          <li key={item} className="flex gap-4 text-lg leading-relaxed text-ink/70">
            <span className="mt-3 w-2 h-2 rounded-full bg-brand shrink-0" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }
  return <p className="mb-7 text-lg md:text-xl leading-relaxed text-ink/68">{block.text}</p>;
}

function InsightTile({
  post,
  index,
  onOpenPost,
}: {
  post: InsightPost;
  index: number;
  onOpenPost: (slug: string) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.65, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white rounded-[1.75rem] border border-ink/10 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-30px_rgba(8,8,10,0.35)]"
    >
      <button onClick={() => onOpenPost(post.slug)} className="w-full text-left" data-cursor="view">
        <span className="block aspect-[4/3] overflow-hidden bg-ink/5">
          <img
            src={post.image}
            alt={post.imageAlt}
            className="w-full h-full object-cover object-top duotone-red transition-transform duration-700 group-hover:scale-[1.05]"
            loading="lazy"
          />
        </span>
        <span className="block p-5 md:p-6">
          <span className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <span className="rounded-full bg-ink text-paper px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]">
              {post.category}
            </span>
            <span className="text-[10px] uppercase tracking-[0.16em] text-ink/50">
              {post.meta}
            </span>
          </span>
          <span className="block font-display font-semibold text-[1.25rem] md:text-[1.4rem] leading-[1.18] transition-colors duration-300 group-hover:text-brand break-words">
            {post.title}
          </span>
          <span className="mt-3 block text-sm leading-relaxed text-ink/70 break-words">{post.excerpt}</span>
          <span className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors group-hover:text-brand">
            Leer insight
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </span>
      </button>
    </motion.article>
  );
}

function DarkInsightTile({
  post,
  index,
  onOpenPost,
}: {
  post: InsightPost;
  index: number;
  onOpenPost: (slug: string) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-[1.75rem] border border-white/10 bg-coal overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:border-brand/50"
    >
      <button onClick={() => onOpenPost(post.slug)} className="w-full text-left" data-cursor="view">
        <span className="block aspect-[4/3] overflow-hidden bg-ink/40">
          <img
            src={post.image}
            alt={post.imageAlt}
            className="w-full h-full object-cover object-top duotone-red transition-transform duration-700 group-hover:scale-[1.05]"
            loading="lazy"
          />
        </span>
        <span className="block p-5 md:p-6">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
            {post.category} · {post.readTime}
          </span>
          <span className="mt-3 block font-display font-semibold text-xl md:text-2xl leading-tight text-paper group-hover:text-brand transition-colors break-words">
            {post.title}
          </span>
        </span>
      </button>
    </motion.article>
  );
}

function BlogMiniFooter({ onBackHome }: { onBackHome: (href?: string) => void }) {
  const { t } = useI18n();
  return (
    <footer className="bg-[#060608] text-paper border-t border-white/[0.07]">
      <div className="px-5 md:px-10 xl:px-16 max-w-[1600px] mx-auto py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <button onClick={() => onBackHome("#top")} className="text-left">
          <Wordmark className="text-xl" />
          <span className="mt-2 block text-xs uppercase tracking-[0.24em] text-smoke">
            {t("page.blog.mini.subtitle")}
          </span>
        </button>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onBackHome("/servicios")}
            className="rounded-full border border-white/15 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] hover:border-brand hover:text-brand transition-colors"
          >
            {t("page.blog.mini.services")}
          </button>
          <button
            onClick={() => onBackHome("/contacto")}
            className="rounded-full bg-brand px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-flame transition-colors"
          >
            {t("page.blog.mini.contact")}
          </button>
        </div>
      </div>
    </footer>
  );
}
