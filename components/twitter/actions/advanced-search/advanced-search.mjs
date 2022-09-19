import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-advanced-search",
  name: "Advanced Search",
  description: "Return Tweets that matches your search criteria. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/search/api-reference/get-search-tweets)",
  version: "0.0.3",
  type: "action",
  props: {
    db: "$.service.db",
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
    lang: {
      propDefinition: [
        twitter,
        "lang",
      ],
    },
    locale: {
      propDefinition: [
        twitter,
        "locale",
      ],
    },
    geocode: {
      propDefinition: [
        twitter,
        "geocode",
      ],
    },
    sinceId: {
      propDefinition: [
        twitter,
        "sinceId",
      ],
    },
    enrichTweets: {
      propDefinition: [
        twitter,
        "enrichTweets",
      ],
    },
    count: {
      propDefinition: [
        twitter,
        "count",
      ],
    },
    maxRequests: {
      propDefinition: [
        twitter,
        "maxRequests",
      ],
    },
  },
  async run({ $ }) {
    const {
      lang,
      locale,
      geocode,
      resultType,
      enrichTweets,
      includeReplies,
      includeRetweets,
      sinceId,
      maxRequests,
      count,
      q,
    } = this;

    // run paginated search
    const res = await this.twitter.paginatedSearch({
      $,
      q,
      sinceId,
      lang,
      locale,
      geocode,
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
