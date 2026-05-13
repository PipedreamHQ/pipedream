import xquik from "../../xquik.app.mjs";

export default {
  key: "xquik-search-tweets",
  name: "Search Tweets",
  description:
    "Search public X/Twitter posts with Xquik. [See the documentation](https://docs.xquik.com/api-reference/overview)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    xquik,
    query: {
      propDefinition: [xquik, "query"],
    },
    queryType: {
      propDefinition: [xquik, "queryType"],
    },
    cursor: {
      propDefinition: [xquik, "cursor"],
    },
    sinceTime: {
      propDefinition: [xquik, "sinceTime"],
    },
    untilTime: {
      propDefinition: [xquik, "untilTime"],
    },
    limit: {
      propDefinition: [xquik, "limit"],
    },
  },
  async run({ $ }) {
    const response = await this.xquik.searchTweets({
      $,
      q: this.query,
      queryType: this.queryType,
      cursor: this.cursor,
      sinceTime: this.sinceTime,
      untilTime: this.untilTime,
      limit: this.limit,
    });

    const tweets =
      response?.tweets ?? response?.data ?? response?.results ?? [];
    const tweetCount = Array.isArray(tweets)
      ? tweets.length
      : (response?.count ?? 0);

    $.export("$summary", `Found ${tweetCount} tweets`);
    return response;
  },
};
