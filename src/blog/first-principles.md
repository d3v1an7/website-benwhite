---
title: First principles
standfirst: Complex problems hate this one simple trick
date: 2025-12-03
tags:
  - tech
---

In a meeting room in 2016 my ears perked up. A much smarter person than me had taken a moment to reflect and said “let’s bring this back to first principles”. I nodded like I knew what that meant. I mean, I had a general idea... but I didn’t know about the secret power of that incantation.

Many times since, I have seen those words duck and weave past the strongest of egos, opinions, and personalities. I could enter rooms with wildly complex problems with seemingly endless and conflicting potential solutions, and would somehow leave with everyone pointed in the same direction.

At Capital Brief, we’re a very tight, very small team, so dropping the ‘first principles’ incantation is less about working past differences, and more about getting to answers quickly and consistently.

Recently, I’ve been trying to get my head around exactly ‘when should we do the heavy lifting for this new feature’. The answer I had landed on had been different for various bits and bobs, and I wanted a system or flow I could use that would make it easier to reason and explain.

Capital Brief is built with [11ty](https://www.11ty.dev/) (a static site generator), has access to [compute at the edge](https://www.cloudflare.com/en-gb/developer-platform/products/workers/), and sprinkles of [AlpineJS](https://alpinejs.dev/) and [HTMX](http://htmx.org/) in the client.

So when it comes to building a new widget, how do we work out what does the heavy lifting? Well, let’s take a look at our first principles (that I just made up now):

- Do hard work early
- Only compute when absolutely necessary
- Keep the client thin

Let’s run some potential website changes through the lens of those principles and see it plays out!

> We need to add a new menu item and index

Let’s generate the menu and index at build time, ship them as plain HTML. This will add a bit of extra compute time to the build, but avoids adding runtime logic.

---

> We need to check the users JWT token and serve different pages to different users

Let’s validate the JWT and decide the user’s access level at the edge, then fetch and serve a pre-built page variant.

---

> We need to add cachebusting to our CSS and JS file paths

Let’s generate hashed asset filenames at build, store a simple mapping, and let a lightweight edge layer rewrite CSS/JS URLs on the fly so the HTML doesn’t need to be rebuilt for every change.

---

> We need our ad placements to update immediately after changes in the CMS

Let’s serve static pages with empty ad slots and use a tiny API/HTMX endpoint that reads the latest pre-built ad config that was generated to fill those slots.

---

When using the lens of first principles, the endless possible solutions for each problem are immediately narrowed down. There is less ambiguity around the approach. We're able to figure out a path faster, and it more likely aligns with stuff we’ve already built.

Neat!
