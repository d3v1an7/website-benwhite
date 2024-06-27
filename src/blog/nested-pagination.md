---
title: Nested pagination with 11ty
standfirst: How to paginate through an array of arrays.
date: 2024-06-27
tags:
  - tech
  - 11ty
---

Let's kick off with a caveat: I don't rely on 11ty collections for building indexes and loops and stuff. I pull down the data I need from a CMS, get it into shape, then use the cleaned up data in WebC template files. This keeps almost all data related transformations in one place (the data file), and allows the templates to be super clean.

Everything that follows here is based on that usage of 11ty data, but I reckon you should be able to follow a similar pattern when building a new collection, if that's more your jam.

Let's say we have a `_data/all.js` file that grabs all articles from a CMS, ending up with something like this:

```
const articles = [
  {
    title: 'Example article',
    authors: [{ slug: 'jake-dog' }, { slug: 'susan-strong' }],
  },
  {
    title: 'Another example',
    authors: [{ slug: 'finn-human' }],
  },
  [etc...]
]
```

Now, we want to create some author indexes (`/author/jake-dog/`), that are also paginated (`/author/jake-dog/2/`).

A data structure that I reckon makes sense here is an array of authors that each have an array of articles.

Unfortunately for us, 11ty pagination only handles a single data set: you can either loop through the authors, or the authors articles, not both. We _could_ solve this by just creating an individual template file for every author, but that doesn't sound like fun. Let's come up with something cleverer! Inspired by [this post](https://www.codeflood.net/blog/2024/04/17/11ty-nested-pagination/) and [this thread](https://github.com/11ty/eleventy/issues/332), I ended up forming an array of authors that instead looked like this:

```
const authors = [
  {
    path: '/author/jake-dog/',
    author: 'jake-dog',
    articles: [ [Object], [Object], [Object] ]
  },
  {
    path: '/author/jake-dog/2/',
    author: 'jake-dog',
    articles: [ [Object], [Object], [Object] ]
  },
  {
    path: '/author/susan-strong/',
    author: 'susan-strong',
    articles: [ [Object], [Object], [Object] ]
  },
  [etc...]
]
```

Now we have a flat array, where each object represents an author index page to be built. Based on that, the WebC template code for our author index pages looks like this:

```
---js
{
  pagination: {
    data: 'all.authors',
    alias: 'item',
    size: 1,
  },
  permalink: ({ item }) => {
    return item.path;
  }
}
---

<h1 @text="item.author"></h1>
<ul webc:for="article of item.articles">
  <li @text="article.title"></li>
</ul>
```

Clean as!

<small>P.S. I'm not a huge fan of the AI-fication of everything right now -- but I ain't gonna lie -- I use ChatGPT quite a bit for tasks like _'pls make this data structure look more like this one over here'_.</small>

---

### TLDR;

- As of today, 11ty only supports a single data set for pagination, and does not have a method to handle further pagination of any nested data sets.
- You can work around this by creating a flat array, where each object contains enough info to build a single page.
- Where you do this work is totally up to you. I like to do it in `_data`, not in the template.
