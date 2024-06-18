import fs from 'fs';

const feeds = fs.readFileSync('./src/_data/feeds.json', 'utf8');
const feedsJson = JSON.parse(feeds);
const sharedMetadata = {
  language: 'en',
  base: 'https://benwhite.com.au/',
  author: {
    name: 'Ben White',
  },
};
const createFeedConfig = ({ collection, rssTitle, description }) => ({
  type: 'atom',
  outputPath: `/rss/${collection}.xml`,
  collection: {
    name: collection,
    limit: 0,
  },
  metadata: {
    title: rssTitle,
    subtitle: description,
    ...sharedMetadata,
  },
});
export const configFeeds = {
  everything: createFeedConfig(feedsJson.everything),
  about: createFeedConfig(feedsJson.about),
  blog: createFeedConfig(feedsJson.blog),
  snippets: createFeedConfig(feedsJson.snippets),
};
