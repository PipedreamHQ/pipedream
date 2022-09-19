import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-simple-search",
  name: "Simple Search",
  description: "Return Tweets that matches your search criteria. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/search/api-reference/get-search-tweets)",
  version: "0.0.7",
  type: "action",
  props: {
    twitter,
    q: {
      propDefinition: [
        twitter,
        "q",
      ],
    },
    resultType: {
      propDefinition: [
        twitter,
        "resultType",
      ],
    },
    includeRetweets: {
      propDefinition: [
        twitter,
        "includeRetweets",
      ],
    },
    includeReplies: {
      propDefinition: [
        twitter,
        "includeReplies",
      ],
    },
  },
  async run({ $ }) {
    const {
      resultType,
      enrichTweets,
      includeReplies,
      includeRetweets,
      maxRequests,
      count,
    } = this;
    let q = this.q;

    // run paginated search
    const res = await this.twitter.paginatedSearch({
      $,
      q,
      resultType,
      enrichTweets,
      includeReplies,
      includeRetweets,
      maxRequests,
      count,
      limitFirstPage: false,
    });
    $.export("$summary", "Search completed successfully");
    return res;
  },
};
