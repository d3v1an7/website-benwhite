---
title: First principles
standfirst: Complex problems hate this one simple trick
date: 2025-12-03
tags:
  - tech
---

In a meeting room in 2016, my ears perked up. A much smarter person than me had taken a moment to reflect and said, “Let’s bring this back to first principles”. I nodded like I knew what that meant. I mean, I had a general idea... but I didn't realise the magical power that incantation holds.

Many times since, I’ve seen those words duck and weave the strongest egos, opinions, and personalities. I could enter rooms with wildly complex problems, each with endless, conflicting potential solutions, and somehow leave with everyone pointed in the same direction, nodding like Robert Redford.

<img src="../../public/redford.gif" alt="Animated image of Robert Redford, the camera moves towards his face slowly, and he nods. The image fills you with satisfaction.">

Recently, I’ve been trying to get my head around what part of our system should do the heavy lifting for any given new feature. As we added new capabilities to our stack, paths that were previously clear cut became murky. I wanted a framework that would help me burn off the fog and help me make choices that were simple to reason and explain. Maybe first principles would help?

---

Capital Brief is built with [11ty](https://www.11ty.dev/) (a static site generator), has access to [compute at the edge](https://www.cloudflare.com/en-gb/developer-platform/products/workers/), and sprinkles of [AlpineJS](https://alpinejs.dev/) and [HTMX](http://htmx.org/) in the client.
So when it comes to building a new widget, we have plenty of options.

Let’s come up with some first principles:

- Do hard work early.
- Only compute when absolutely necessary.
- Keep the client thin.

Now, let those first principles guide the thinking for some potential website changes.

> We need to add a new menu item and related paginated index of stories.

Let’s generate the menu and index at build time and ship them as plain HTML (hard work early). This adds some compute to the build but avoids adding runtime logic (keep the client thin).

---

> We need to check the user’s JWT token and serve different pages to different users.

Let’s validate the JWT and determine the user’s access level at the edge (keep the client thin), then fetch and serve a pre-built page variant (hard work early).

---

> We need to add cachebusting to our CSS and JS file paths.

Let’s generate hashed asset filenames at build (hard work early), store a simple mapping, and let a lightweight edge worker rewrite CSS/JS URLs on the fly so the HTML doesn’t need to be rebuilt for every change (reduce compute).

---

> We need our ad placements to update immediately after changes in the CMS.

Let’s serve static pages with empty ad slots (reduce compute) and use a tiny API/HTMX endpoint that reads the latest pre-built ad config (hard work early) to fill those slots.

---

Through the lens of first principles, the endless possible solutions for each problem narrow immediately. There’s less ambiguity. We find our path faster, and what we build will more likely align with patterns we’ve already made.

Neat!
