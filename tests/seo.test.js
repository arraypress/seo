import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildHead, injectHead, robotsTxt, escapeHtml } from '../src/index.js';

describe('buildHead', () => {
  it('renders title only', () => {
    const html = buildHead({ title: 'Hello' });
    assert.ok(html.includes('<title>Hello</title>'));
  });
  it('renders canonical URL', () => {
    const html = buildHead({ url: 'https://example.com/page' });
    assert.ok(html.includes('<link rel="canonical" href="https://example.com/page">'));
  });
  it('renders description meta', () => {
    const html = buildHead({ description: 'A test page' });
    assert.ok(html.includes('<meta name="description" content="A test page">'));
  });
  it('renders robots directive', () => {
    const html = buildHead({ robots: 'noindex, nofollow' });
    assert.ok(html.includes('<meta name="robots" content="noindex, nofollow">'));
  });
  it('renders Open Graph tags', () => {
    const html = buildHead({ title: 'OG Test', url: 'https://example.com', description: 'Desc', image: 'https://example.com/img.png', siteName: 'My Site', locale: 'en_US' });
    assert.ok(html.includes('og:title'));
    assert.ok(html.includes('og:url'));
    assert.ok(html.includes('og:description'));
    assert.ok(html.includes('og:image'));
    assert.ok(html.includes('og:site_name'));
    assert.ok(html.includes('og:locale'));
  });
  it('defaults og:type to website', () => {
    const html = buildHead({});
    assert.ok(html.includes('og:type" content="website"'));
  });
  it('renders article meta', () => {
    const html = buildHead({ articlePublished: '2025-01-01', articleModified: '2025-06-01', articleAuthor: 'Jane' });
    assert.ok(html.includes('article:published_time'));
    assert.ok(html.includes('article:modified_time'));
    assert.ok(html.includes('article:author'));
  });
  it('renders Twitter Card tags', () => {
    const html = buildHead({ title: 'Tweet', description: 'Desc', image: 'https://img.png', twitterSite: '@site', twitterCreator: '@author' });
    assert.ok(html.includes('twitter:card" content="summary_large_image"'));
    assert.ok(html.includes('twitter:title'));
    assert.ok(html.includes('twitter:description'));
    assert.ok(html.includes('twitter:image'));
    assert.ok(html.includes('twitter:site'));
    assert.ok(html.includes('twitter:creator'));
  });
  it('defaults Twitter Card to summary without image', () => {
    const html = buildHead({ title: 'No Image' });
    assert.ok(html.includes('twitter:card" content="summary"'));
  });
  it('renders verification tags', () => {
    const html = buildHead({ verification: { google: 'g123', bing: 'b456', pinterest: 'p789', yandex: 'y000' } });
    assert.ok(html.includes('google-site-verification" content="g123"'));
    assert.ok(html.includes('msvalidate.01" content="b456"'));
    assert.ok(html.includes('p:domain_verify" content="p789"'));
    assert.ok(html.includes('yandex-verification" content="y000"'));
  });
  it('renders hreflang links', () => {
    const html = buildHead({ hreflang: [{ lang: 'en', url: 'https://en.example.com' }, { lang: 'fr', url: 'https://fr.example.com' }] });
    assert.ok(html.includes('hreflang="en"'));
    assert.ok(html.includes('hreflang="fr"'));
  });
  it('injects JSON-LD script', () => {
    const ld = { '@type': 'Product', name: 'Widget' };
    const html = buildHead({ jsonLd: ld });
    assert.ok(html.includes('<script type="application/ld+json">'));
    assert.ok(html.includes('"@type":"Product"'));
  });
  it('injects multiple JSON-LD scripts', () => {
    const ld = [{ '@type': 'Product' }, { '@type': 'Organization' }];
    const html = buildHead({ jsonLd: ld });
    const matches = html.match(/ld.json/g);
    assert.equal(matches.length, 2);
  });
  it('escapes HTML entities in values', () => {
    const html = buildHead({ title: 'A & B <script>' });
    assert.ok(html.includes('A &amp; B &lt;script&gt;'));
  });
});

describe('injectHead', () => {
  it('replaces existing title and injects before </head>', () => {
    const doc = '<html><head><title>Old</title></head><body></body></html>';
    const result = injectHead(doc, '<title>New</title>');
    assert.ok(result.includes('<title>New</title>'));
    assert.ok(!result.includes('Old'));
  });
  it('injects before </head>', () => {
    const doc = '<html><head></head><body></body></html>';
    const result = injectHead(doc, '<meta name="test" content="ok">');
    assert.ok(result.includes('<meta name="test" content="ok">\n</head>'));
  });
});

describe('robotsTxt', () => {
  it('generates basic robots.txt', () => {
    const txt = robotsTxt({});
    assert.ok(txt.includes('User-agent: *'));
  });
  it('includes sitemap URL', () => {
    const txt = robotsTxt({ sitemapUrl: 'https://example.com/sitemap.xml' });
    assert.ok(txt.includes('Sitemap: https://example.com/sitemap.xml'));
  });
  it('includes allow and disallow rules', () => {
    const txt = robotsTxt({ allow: ['/public'], disallow: ['/admin', '/api'] });
    assert.ok(txt.includes('Allow: /public'));
    assert.ok(txt.includes('Disallow: /admin'));
    assert.ok(txt.includes('Disallow: /api'));
  });
  it('includes crawl delay', () => {
    const txt = robotsTxt({ crawlDelay: 10 });
    assert.ok(txt.includes('Crawl-delay: 10'));
  });
});

describe('escapeHtml', () => {
  it('escapes special characters', () => {
    assert.equal(escapeHtml('a & b < c > d "e"'), 'a &amp; b &lt; c &gt; d &quot;e&quot;');
  });
  it('returns empty string for falsy input', () => {
    assert.equal(escapeHtml(''), '');
    assert.equal(escapeHtml(null), '');
    assert.equal(escapeHtml(undefined), '');
  });
});
