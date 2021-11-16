import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-advanced-search",
  name: "Advanced Search",
  description: "Return Tweets that matches your search criteria.",
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
  async run() {
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

    const limitFirstPage = !sinceId;

    // run paginated search
    return this.twitter.paginatedSearch({
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
      limitFirstPage,
    });
  },
};
