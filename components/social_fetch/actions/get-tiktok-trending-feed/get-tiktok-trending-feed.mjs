import app from "../../social_fetch.app.mjs";

export default {
  key: "social_fetch-get-tiktok-trending-feed",
  name: "Get TikTok Trending Feed",
  description: "Fetches the current TikTok trending feed for a given region. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/tiktok/feed/trending&method=GET)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    region: {
      type: "string",
      label: "Region",
      description: "Two-letter country code for the trending region (string). E.g. `US`, `GB`, `DE`.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getTiktokTrendingFeed({
      $,
      region: this.region,
    });
    $.export("$summary", `Successfully fetched TikTok trending feed for region "${this.region}"`);
    return response;
  },
};
