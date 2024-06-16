const feedAbout = {
  collection: 'about',
  title: 'About',
  description: 'About description.',
};
const feedBlog = {
  collection: 'blog',
  title: 'Blog',
  description: 'Blog description.',
};
const feedSnippets = {
  collection: 'snippets',
  title: 'Snippets',
  description: 'Snippets description.',
};
const sharedMetadata = {
  language: 'en',
  base: 'https://benwhite.com.au/',
  author: {
    name: 'Ben White',
  },
};
const createFeedConfig = ({ collection, title, description }) => ({
  type: 'atom',
  outputPath: `/rss/${collection}.xml`,
  collection: {
    name: collection,
    limit: 0,
  },
  metadata: {
    title,
    subtitle: description,
    ...sharedMetadata,
  },
});
export const configFeeds = {
  about: createFeedConfig(feedAbout),
  blog: createFeedConfig(feedBlog),
  snippets: createFeedConfig(feedSnippets),
};
