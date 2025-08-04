---
title: Migrating an 11ty site from Cloudflare Pages to Workers
standfirst: It's Workers all the way down.
date: 2025-08-04
tags:
  - tech
  - cloudflare
  - workers
---

If you're reading this, I'm guessing you've got an 11ty site live on Cloudflare Pages somewhere, and you've probably come across one of the _many_ Cloudflare messages and prompts asking you nicely to move off Pages and over to Workers. It's a bummer, because Cloudflare Pages is a really great product!

If you've used GitHub Pages or Netlify, Cloudflare Pages is easy to pick up. But diving into the [Worker docs](https://developers.cloudflare.com/workers/) ([and even the Migration docs](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)), they can seem pretty complicated, because, well... they are. For now, let's try and skip past all the complex stuff and just get a Worker to serve our 11ty build.

I'm gonna start with some assumptions:

- You have a working 11ty site, which is currently running on Cloudflare Pages
- You can build your 11ty site on your own machine
- We're skipping multiple environments, secrets and environment variables for now, and just spinning up on local and prod (you can have as many environments as you want, but let's keep it simple for now)
- We're going to set things up with commands in a terminal (this is not strictly required, you can set up Workers via the UI, but do note that changes in the UI will be lost the next time you deploy via terminal and vice versa -- best to choose your preferred method of working and stick with that)
- We're going to focus on just the site HTML for now, Cloudflare Pages functions or middleware can come later

Let's get into it!

### 1. Install `wrangler` and login

`wrangler` is the tool for managing your Worker (both for local development, and deploying to production).
[The docs recommend installing `wrangler` as a project dependency](https://developers.cloudflare.com/workers/wrangler/install-and-update/) via `npm i -D wrangler@latest`.
That's generally good advice, but if you prefer managing things via `brew`, or want to install it globally, you can absolutely just do that.

Once installed, run `npx wrangler login`, which will open a browser window asking you to sign in to Cloudflare and authorise `wrangler`.

### 2. Configure your Worker

In your project root (probably where your 11ty config lives), add a new `wrangler.jsonc` file (`wrangler.toml` is also valid, but JSONC seems like the recommended path these days).

You might already have this file if you deployed your Pages project via code. If so, make sure to remove `pages_build_output_dir`.

Below is an example for my site, you can fill in the blanks.

```
{
  "name": "website-benwhite",
  "compatibility_date": "2025-05-05",
  "assets": {
    "directory": "_site",
    "not_found_handling": "404-page",
  },
  "routes": [{ "pattern": "benwhite.com.au", "custom_domain": true }],
}
```

- `name`: This will be the name of the Worker in the Cloudflare UI, which is only public if you choose to use the `{worker-name}.workers.dev` URL for anything
- `assets.directory`: You only need to update this if you've set 11ty up to build somewhere else, `_site` is the default 11ty build path
- `routes[0].pattern`: Make sure you add the `www.` to your own domain, if that's how your site is currently set up!

The assets config is basically the most important bit, and tells the Worker where to find all the files for your site build. The [Static Assets docs have a bunch more detail](https://developers.cloudflare.com/workers/static-assets/).

Defining the route in code is just a neat way to reduce the clicks needed in connecting your DNS to the Worker. But as mentioned above, if you want to handle the routes via the UI instead, you can just remove that line.

By not defining a `main` script file AND setting up `assets`, we're letting Cloudflare know we want to create an "assets-only Worker". If you want to change this later to move over your Cloudflare Pages Functions, that's totally fine. All of these choices can be changed later without fuss.

### 3. Update `.gitignore` and `package.json`.

Add the `.wrangler/` directory to `.gitignore`.

Now, it's time to connect some dots with `package.json` scripts. Here's how I've done it:

```
"scripts": {
  "11ty:build": "npx @11ty/eleventy",
  "11ty:watch": "npx @11ty/eleventy --watch --quiet --ignore-initial",
  "11ty:benchmark": "DEBUG=Eleventy:Benchmark* npm run build",
  "build": "11ty:build",
  "util:rimraf": "npx rimraf _site",
  "util:killport": "npx kill-port --port 8787",
  "start": "npm-run-all util:rimraf util:killport 11ty:build --parallel 11ty:watch wrangler:dev",
  "wrangler:dev": "npx wrangler dev --live-reload",
  "wrangler:deploy": "npx wrangler deploy"
},
```

No two `package.json` files are alike, so I'll just step through the important stuff:

- `11ty:build`: Just do the build, nice and simple
- `11ty:watch`: Run build if something changes, used for local dev only. We're using `--ignore-initial` here because we want to run a regular 11ty build beforehand
- `start`: `wrangler` gets a bit confused if `_site` isn't ready to go. That's why we run the regular build before running the watch build

How you handle this is very much up to how you handle your own build, but they key takeaway is that your `11ty --watch` process should run in parallel with `wrangler dev`. This will allow live reload to work.

### 4. Test and deploy

Run `npm run start` (or however you kick off your local stuff), and see if everything works as expected. You'll note `wrangler` spins up your Worker on `8787`. [You can change that (and many other settings) if you want](https://developers.cloudflare.com/workers/wrangler/configuration/#local-development-settings).

If everything is all okay, run the deploy script `npm run wrangler:deploy` (or just run it directly with `npx wrangler deploy`).

NOTE: If you set up your domain as a route in the `wrangler.jsonc` but Cloudflare DNS already has a record assigned for that domain/subdomain, you will likely get an error here. You'll need to manually delete it via the Cloudflare DNS web UI before you're allowed to deploy. Keep a screenshot of those settings before removing, just in case you want to roll back.

### 5. Optional: Connect the Worker to your Git repo

This is optional. If you're fine running the build and deploy commands locally and manually, you don't need this. Enabling this connection will ensure any merge to `main` will kick of a new build and deploy in Cloudflare instead. I couldn't find a way to configure this in `wrangler.jsonc` yet, but [the docs recommend creating this links via the UI in any case](https://developers.cloudflare.com/workers/ci-cd/builds/).

And you're done!

I'll dive into moving functions over soon. Until then, I've shared some [example `wrangler` config snippets that should hopefully give you a head start](/snippets/pages-to-workers-config/).

If you're getting stuck with your move, I'm happy to chat and help where I can, just ping me on [Mastodon](https://infosec.exchange/deck/@d3v1an7).
