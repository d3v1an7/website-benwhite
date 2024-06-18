export const configCollections = {
  everything(collectionApi) {
    return collectionApi
      .getAll()
      .filter(
        (item) =>
          item.data.tags &&
          !item.data.eleventyExcludeFromCollections &&
          (item.data.tags.includes('about') ||
            item.data.tags.includes('blog') ||
            item.data.tags.includes('snippets')),
      );
  },
};
