export interface BuildHeadOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  robots?: string;
  siteName?: string;
  twitterCard?: string;
  twitterSite?: string;
  twitterCreator?: string;
  /** twitter:image:alt — only emitted when an `image` is set. */
  twitterImageAlt?: string;
  locale?: string;
  articlePublished?: string;
  articleModified?: string;
  articleAuthor?: string;
  verification?: {
    google?: string;
    bing?: string;
    pinterest?: string;
    yandex?: string;
  };
  hreflang?: Array<{ lang: string; url: string }>;
  jsonLd?: object | object[];
  /** Extra `<meta>` tags — each object's keys become attributes
   *  (`true` → bare attribute, null/false/undefined → omitted). For
   *  anything the typed options don't cover (viewport, theme-color, …). */
  meta?: Array<Record<string, string | number | boolean | undefined>>;
  /** Extra `<link>` tags — same attribute rules as `meta`. */
  link?: Array<Record<string, string | number | boolean | undefined>>;
}

/** Build a complete <head> HTML string from options. */
export function buildHead(options?: BuildHeadOptions): string;

/** Inject head HTML into an HTML document (before </head>). Replaces existing <title>. */
export function injectHead(html: string, headHtml: string): string;

export interface RobotsTxtOptions {
  sitemapUrl?: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
  customRules?: string[];
}

/** Generate robots.txt content. */
export function robotsTxt(options?: RobotsTxtOptions): string;

/** Escape HTML entities in a string. */
export function escapeHtml(str: string): string;
