import app from "../../social_fetch.app.mjs";

export default {
  key: "social_fetch-get-youtube-trending-shorts",
  name: "Get YouTube Trending Shorts",
  description: "Fetches the current trending YouTube Shorts. No query is required; call with no inputs to get current trending Shorts. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/youtube/shorts/trending&method=GET)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getYoutubeTrendingShorts({
      $,
    });
    $.export("$summary", "Successfully fetched trending YouTube Shorts");
    return response;
  },
};
