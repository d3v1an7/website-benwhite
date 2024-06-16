# website-benwhite

## WIP

- [x] Indexes
- [x] Beadcrumbs
- [x] Header nav
- [x] Footer nav
- [x] Dark mode toggle
- [x] Settle on a naming convention for components
- [x] 404
- [x] Tidy 11ty config
- [x] RSS
- [x] Small breakpoint styling/menu
- [ ] Sitemap
- [ ] Cachebusting strat for css
- [ ] SEO/head tags
- [ ] Build pipeline
- [ ] Actual content

## Later

- [ ] Search
- [ ] Full site feed

## Stack

- The site is built with [Eleventy](https://www.11ty.dev/), which handles the static HTML template, pages and navigation.
- The template and component language is [WebC](https://www.11ty.dev/docs/languages/webc/).
- The CSS framework used is [Tailwind](https://tailwindcss.com/).
- The build, deploy and hosting of the website is handled by [Cloudflare](https://www.cloudflare.com/).

## Build

Changes to the `main` branch will kick off a build and deploy to [benwhite.com.au](https://benwhite.com.au/).

## Local development

```
# Deps
brew install nodenv
nodenv install
# TODO: Probably some Cloudflare tooling here?

# Site
git clone git@github.com:d3v1an7/website.git ~/workspace/website && cd ~/workspace/website
npm install
```
