---
title: WebC at scale
standfirst: Some things to check when going from hundreds to thousands.
date: 2024-08-07
tags:
  - tech
  - 11ty
  - webc
---

When setting out to build _Capital Brief_, 11ty (v2 at the time) supported [on-demand builders in Netlify](https://www.netlify.com/blog/2021/04/14/faster-builds-for-large-sites-on-netlify-with-on-demand-builders-now-in-early-access/) via the [11ty serverless plugin](https://www.11ty.dev/docs/plugins/serverless/). This allowed me to use a build strategy along the lines of:

- Build the most recent stories and first page of each index
- Use on-demand builds for the rest

This gave us predicable build times and ensured the pages we expected humans to read were super fast.

Sounds good right? Unfortunately for me:

- The latest version of 11ty (v3 at time of writing) removes the Netlify based serverless plugin, and
- The long tail of on-demand pages (which by design, are a bit slower on first access) has a negative impact in Google PageSpeed Insights

So the new build strategy is: **build all the things**.

All fun and games in theory, but the second the rubber hit the road, the build failed with:

```FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory```

I gave the process 8GB of RAM: `npx --node-options='--max-old-space-size=8192' @11ty/eleventy --serve --quiet`... and got the same error.

Uh oh.

So I started breaking things up into smaller chunks to see what part of the build was the most expensive. Here's what I found:

### Use @raw instead of @html

Since the good old days, I've used a layout pattern like:

**base.webc**

```
<!doctype html>
<html
  <head></head>
  <body>
    <template webc:nokeep @html="content"></template>
  </body>
</html>
```

**page.webc**

```
---
layout: base.webc
---

<custom-header></custom-header>
<main @html="content"></main>
<custom-footer></custom-footer>
```

I'm pretty sure it's a standard pattern, and from my first read of the WebC docs, the usage of `@html` seems right?

```
- Content returned from the @html prop will be processed as WebC.
- Using [@raw] will prevent processing the result as WebC.
```

Turns out that _in the context of a layout_, using `@html` for `content` is not necessary, and just super expensive.

Out of everything I discovered, this is the biggest, easiest, and most practical win. I haven't dug into the internals to work out why, but this change is what allowed the build to complete without running out of memory.

### Avoid nesting WebC components, where practical

This change had a smaller impact, but I noticed improvements when reducing component and layout nesting, particularly where the data being passed through was chunky. As a follow up example from above, instead of splitting the layouts into `base` + `page`, I now use use just `page`.

**page.webc**

```
<!doctype html>
<html
  <head></head>
  <body>
    <custom-header></custom-header>
    <main @raw="content"></main>
    <custom-footer></custom-footer>
  </body>
</html>
```

### Get expensive data into required shape

If you're in a position where every millisecond counts, you can shave a few off by getting complex or looped data ready as HTML in your data first, then use `<div @raw="related.html"></div>` instead of `<div webc:for="related.items">...</div>`.

I actually rolled this change back in the end, as the many costs of the change outweighed the benefit. I much, much prefer to handle the HTML in the template rather than in data.

---

### TLDR;

- Use of some WebC props get expensive as the number of files to build grows.
- Using `@raw` instead of `@html` will provide the biggest performance boost, particularly if used in layout files.
- Nesting of WebC components can slow things down, especially if you're passing large objects or content as props.
- You can trim a few milliseconds off by pre-processing complex HTML, but doing this might not be worth the many tradeoffs.
