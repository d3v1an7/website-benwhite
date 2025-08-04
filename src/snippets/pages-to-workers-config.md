---
title: Worker config examples
standfirst:
date: 2025-08-04
tags:
  - tech
  - cloudflare
  - workers
---

Some config snippets to support the [Migrating an 11ty site from Cloudflare Pages to Workers](/blog/pages-to-workers/) blog.

### Assets only Worker

This config should work for most straight up, simple, no fuss migrations from Cloudflare Pages to Workers.

**`wrangler.jsonc`**

```json
{
  "name": "name-of-worker-here",
  "compatibility_date": "2025-05-05",
  "assets": { "directory": "_site", "not_found_handling": "404-page" }
}
```

### Assets and Functions (or APIs) Worker

This config should provide a path forward for anyone that was using Cloudflare Pages Functions for simple APIs.

**`wrangler.jsonc`**

```json
{
  "name": "name-of-worker-here",
  "compatibility_date": "2025-05-05",
  "main": "src/index.js",
  "assets": {
    "directory": "_site",
    "not_found_handling": "404-page",
    "run_worker_first": ["/api/*"]
  }
}
```

**`src/index.js`**

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      // API code goes here.
      const exampleResponse = { hello: 'world' };
      return Response.json(exampleResponse);
    }
    return request;
  },
};
```

### Assets (via middleware) and API Worker

This is a more advanced path for users who were using Cloudflare Pages Functions for simple APIs along with `_middleware.js` for intercepting and modifying responses on the way through. You could probably do it without switching over to `hono`, but from my limited time using it, `hono` is _excellent_ and worth the time learning how it works.

This will push pretty much everything through the Worker, so tread with caution if you're running a site with spiky traffic.

**Install `hono`**

```shell
npm install hono
```

**`wrangler.jsonc`**

```json
{
  "name": "name-of-worker-here",
  "main": "src/index.js",
  "compatibility_date": "2025-05-05",
  "assets": {
    "binding": "ASSETS",
    "directory": "_site",
    "run_worker_first": true
  },
  "services": [{ "binding": "SELF", "service": "name-of-worker-here" }]
}
```

**`src/index.js`**

```javascript
import { Hono } from 'hono';

const app = new Hono();

// Set up API routes.
app.get('/api/*', (c) => {
  const exampleResponse = { hello: 'world' };
  return c.json(exampleResponse);
});

// Serve static assets with middleware support.
app.get('*', async (c) => {
  try {
    // Bail early for non-HTML requests (fonts, images, etc).
    const accept = c.req.header('accept') || '';
    if (!accept.includes('text/html')) {
      return await c.env.ASSETS.fetch(c.req.url);
    }
    // Get requested the asset from the _site build.
    const assetResponse = await c.env.ASSETS.fetch(c.req.url);
    if (assetResponse.ok) {
      // Add 'hello world' to the asset HTML response.
      return new HTMLRewriter()
        .on('body', {
          async element(element) {
            element.prepend('<h1>hello world</h1>', { html: true });
          },
        })
        .transform(assetResponse);
    }
  } catch (error) {
    console.error(error);
  }
  return c.notFound();
});

// Handle 404s gracefully.
app.notFound(async (c) => {
  const url = new URL(c.req.url);
  const res = await c.env.SELF.fetch(`${url.origin}/404`);
  return c.html(await res.text(), 404);
});

export default app;
```
