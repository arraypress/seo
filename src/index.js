// Escape HTML entities in attribute values
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Build a complete <head> HTML string from options
export function buildHead(options = {}) {
  const { title, description, image, url, type = 'website', robots, siteName,
    twitterCard, twitterSite, twitterCreator,
    locale, articlePublished, articleModified, articleAuthor,
    verification = {}, hreflang = [], jsonLd } = options;

  const parts = [];

  if (title) parts.push(`<title>${esc(title)}</title>`);
  if (url) parts.push(`<link rel="canonical" href="${esc(url)}">`);
  if (description) parts.push(`<meta name="description" content="${esc(description)}">`);
  if (robots) parts.push(`<meta name="robots" content="${esc(robots)}">`);

  // Open Graph
  if (title) parts.push(`<meta property="og:title" content="${esc(title)}">`);
  parts.push(`<meta property="og:type" content="${esc(type)}">`);
  if (url) parts.push(`<meta property="og:url" content="${esc(url)}">`);
  if (description) parts.push(`<meta property="og:description" content="${esc(description)}">`);
  if (image) parts.push(`<meta property="og:image" content="${esc(image)}">`);
  if (siteName) parts.push(`<meta property="og:site_name" content="${esc(siteName)}">`);
  if (locale) parts.push(`<meta property="og:locale" content="${esc(locale)}">`);

  // Article-specific OG
  if (articlePublished) parts.push(`<meta property="article:published_time" content="${esc(articlePublished)}">`);
  if (articleModified) parts.push(`<meta property="article:modified_time" content="${esc(articleModified)}">`);
  if (articleAuthor) parts.push(`<meta property="article:author" content="${esc(articleAuthor)}">`);

  // Twitter Card
  const cardType = twitterCard || (image ? 'summary_large_image' : 'summary');
  parts.push(`<meta name="twitter:card" content="${esc(cardType)}">`);
  if (title) parts.push(`<meta name="twitter:title" content="${esc(title)}">`);
  if (description) parts.push(`<meta name="twitter:description" content="${esc(description)}">`);
  if (image) parts.push(`<meta name="twitter:image" content="${esc(image)}">`);
  if (twitterSite) parts.push(`<meta name="twitter:site" content="${esc(twitterSite)}">`);
  if (twitterCreator) parts.push(`<meta name="twitter:creator" content="${esc(twitterCreator)}">`);

  // Site verification
  if (verification.google) parts.push(`<meta name="google-site-verification" content="${esc(verification.google)}">`);
  if (verification.bing) parts.push(`<meta name="msvalidate.01" content="${esc(verification.bing)}">`);
  if (verification.pinterest) parts.push(`<meta name="p:domain_verify" content="${esc(verification.pinterest)}">`);
  if (verification.yandex) parts.push(`<meta name="yandex-verification" content="${esc(verification.yandex)}">`);

  // hreflang
  for (const tag of hreflang) {
    if (tag.lang && tag.url) parts.push(`<link rel="alternate" hreflang="${esc(tag.lang)}" href="${esc(tag.url)}">`);
  }

  // JSON-LD injection
  const ldItems = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  for (const ld of ldItems) {
    parts.push(`<script type="application/ld+json">${JSON.stringify(ld)}</script>`);
  }

  return parts.join('\n');
}

// Inject head HTML into an HTML document (before </head>)
export function injectHead(html, headHtml) {
  let result = html.replace(/<title>[^<]*<\/title>/, '');
  return result.replace('</head>', headHtml + '\n</head>');
}

// Generate robots.txt content
export function robotsTxt(options = {}) {
  const { sitemapUrl, allow = [], disallow = [], crawlDelay, customRules = [] } = options;
  const lines = ['User-agent: *'];
  for (const path of allow) lines.push(`Allow: ${path}`);
  for (const path of disallow) lines.push(`Disallow: ${path}`);
  if (crawlDelay) lines.push(`Crawl-delay: ${crawlDelay}`);
  for (const rule of customRules) lines.push(rule);
  if (sitemapUrl) lines.push('', `Sitemap: ${sitemapUrl}`);
  return lines.join('\n') + '\n';
}

// Escape HTML helper (exported for external use)
export { esc as escapeHtml };
