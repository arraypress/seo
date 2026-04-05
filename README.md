# @arraypress/seo

HTML meta tag builder for SEO. Open Graph, Twitter Cards, canonical URLs, robots directives, hreflang, and site verification. Zero dependencies.

## Installation

```bash
npm install @arraypress/seo
```

## Usage

```js
import { buildHead, injectHead, robotsTxt } from '@arraypress/seo';

const head = buildHead({
  title: 'My Page',
  description: 'A great page',
  url: 'https://example.com/page',
  image: 'https://example.com/og.png',
  siteName: 'Example',
  twitterSite: '@example',
});

const html = injectHead('<html><head></head><body>...</body></html>', head);

const robots = robotsTxt({
  sitemapUrl: 'https://example.com/sitemap.xml',
  disallow: ['/admin'],
});
```

## API

### `buildHead(options?)`

Build a complete `<head>` HTML string from options.

| Option | Type | Description |
|--------|------|-------------|
| `title` | `string` | Page title |
| `description` | `string` | Meta description |
| `image` | `string` | OG/Twitter image URL |
| `url` | `string` | Canonical URL |
| `type` | `string` | OG type (default: `website`) |
| `robots` | `string` | Robots directive |
| `siteName` | `string` | OG site name |
| `twitterCard` | `string` | Twitter card type (auto-detected from image) |
| `twitterSite` | `string` | Twitter @username for site |
| `twitterCreator` | `string` | Twitter @username for author |
| `locale` | `string` | OG locale |
| `articlePublished` | `string` | Article published date (ISO 8601) |
| `articleModified` | `string` | Article modified date (ISO 8601) |
| `articleAuthor` | `string` | Article author name |
| `verification` | `object` | Site verification codes (`google`, `bing`, `pinterest`, `yandex`) |
| `hreflang` | `array` | Alternate language links (`{ lang, url }`) |
| `jsonLd` | `object | array` | JSON-LD structured data to inject |

### `injectHead(html, headHtml)`

Inject head HTML into an HTML document string. Replaces any existing `<title>` and inserts before `</head>`.

### `robotsTxt(options?)`

Generate robots.txt content.

| Option | Type | Description |
|--------|------|-------------|
| `sitemapUrl` | `string` | Sitemap URL to include |
| `allow` | `string[]` | Allowed paths |
| `disallow` | `string[]` | Disallowed paths |
| `crawlDelay` | `number` | Crawl delay in seconds |
| `customRules` | `string[]` | Additional raw lines |

### `escapeHtml(str)`

Escape HTML entities (`&`, `"`, `<`, `>`) in a string. Returns empty string for falsy input.

## License

MIT
