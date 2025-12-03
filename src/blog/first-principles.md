---
title: First principles
standfirst: Complex problems hate this one simple trick
date: 2025-12-03
tags:
  - tech
---

In a meeting room in 2016, my ears perked up. A much smarter person than me had taken a moment to reflect and said, “Let’s bring this back to first principles”. I nodded like I knew what that meant. I mean, I had a general idea... but I didn’t know about the secret power of that incantation.

Many times since, I’ve seen those words duck and weave past the strongest egos, opinions, and personalities. I could enter rooms with wildly complex problems, each with endless, conflicting potential solutions, and somehow leave with everyone pointed in the same direction.

At Capital Brief, we’re a very tight, very small team, so dropping the “first principles” incantation is less about working past differences and more about getting to answers quickly and consistently.

Recently, I’ve been trying to get my head around when we should do the heavy lifting for a new feature. The answer had been different for various bits and pieces, and I wanted a system I could use that made it easier to reason and explain.

Capital Brief is built with [11ty](https://www.11ty.dev/) (a static site generator), has access to [compute at the edge](https://www.cloudflare.com/en-gb/developer-platform/products/workers/), and sprinkles of [AlpineJS](https://alpinejs.dev/) and [HTMX](http://htmx.org/) in the client.

So when it comes to building a new widget, how do we work out what should do the heavy lifting? Let’s look at the first principles (that I just made up):

- Do hard work early.
- Only compute when absolutely necessary.
- Keep the client thin.

Let’s run some potential website changes through that lens and see how it plays out.

> We need to add a new menu item and index.

Let’s generate the menu and index at build time and ship them as plain HTML. This adds some compute to the build but avoids adding runtime logic.

---

> We need to check the user’s JWT token and serve different pages to different users.

Let’s validate the JWT and determine the user’s access level at the edge, then fetch and serve a pre-built page variant.

---

> We need to add cachebusting to our CSS and JS file paths.

Let’s generate hashed asset filenames at build, store a simple mapping, and let a lightweight edge worker rewrite CSS/JS URLs on the fly so the HTML doesn’t need to be rebuilt for every change.

---

> We need our ad placements to update immediately after changes in the CMS.

Let’s serve static pages with empty ad slots and use a tiny API/HTMX endpoint that reads the latest pre-built ad config to fill those slots.

---

Through the lens of first principles, the endless possible solutions for each problem narrow immediately. There’s less ambiguity. We find our path faster, and what we build will more likely align with patterns we’ve already made.

Neat!
