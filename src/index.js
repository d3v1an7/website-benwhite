export default {
  // NOTE: By default, if a requested URL matches a file in the static assets directory,
  // that file will be served without invoking Worker code. We're only adding this code
  // because it's required for deploy.
  // Read more here: https://developers.cloudflare.com/workers/static-assets/#routing-behavior
  async fetch(request, env) {
    const url = new URL(request.url);
    return env.ASSETS.fetch(request);
  },
};
