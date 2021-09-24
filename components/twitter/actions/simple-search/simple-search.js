const twitter = require("../../twitter.app.js");

module.exports = {
  key: "twitter-simple-search",
  name: "Simple Search",
  description: "Return Tweets that matches your search criteria",
  version: "0.0.6",
  type: "action",
  props: {
    twitter,
    q: {
      propDefinition: [
        twitter,
        "q",
      ],
    },
    result_type: {
      propDefinition: [
        twitter,
        "result_type",
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
  async run() {
    const {
      result_type: resultType,
      enrichTweets,
      includeReplies,
      includeRetweets,
      maxRequests,
      count,
    } = this;
    let q = this.q, limitFirstPage;

    limitFirstPage = true;

    // run paginated search
    return await this.twitter.paginatedSearch({
      q,
      result_type: resultType,
      enrichTweets,
      includeReplies,
      includeRetweets,
      maxRequests,
      count,
      limitFirstPage,
    });
  },
};
