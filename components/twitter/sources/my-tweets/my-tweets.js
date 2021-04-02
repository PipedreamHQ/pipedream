const base = require("../common/tweets");

module.exports = {
  ...base,
  key: "twitter-my-tweets",
  name: "My Tweets",
  description: "Emit new Tweets you post to Twitter",
  version: "0.0.5",
  props: {
    ...base.props,
    q: {
      propDefinition: [
        base.props.twitter,
        "keyword_filter",
      ],
    },
    result_type: {
      propDefinition: [
        base.props.twitter,
        "result_type",
      ],
    },
    includeRetweets: {
      propDefinition: [
        base.props.twitter,
        "includeRetweets",
      ],
    },
    includeReplies: {
      propDefinition: [
        base.props.twitter,
        "includeReplies",
      ],
    },
    lang: {
      propDefinition: [
        base.props.twitter,
        "lang",
      ],
    },
    locale: {
      propDefinition: [
        base.props.twitter,
        "locale",
      ],
    },
    geocode: {
      propDefinition: [
        base.props.twitter,
        "geocode",
      ],
    },
    enrichTweets: {
      propDefinition: [
        base.props.twitter,
        "enrichTweets",
      ],
    },
  },
  methods: {
    ...base.methods,
    async getSearchQuery() {
      const account = await this.twitter.verifyCredentials();
      const from = `from:${account.screen_name}`;
      return this.q
        ? `${from} ${this.q}`
        : from;
    },
    async retrieveTweets() {
      const {
        lang,
        locale,
        geocode,
        result_type,
        enrichTweets,
        includeReplies,
        includeRetweets,
        maxRequests,
        count,
      } = this;
      const since_id = this.getSinceId();
      const limitFirstPage = !since_id;
      const q = await this.getSearchQuery();

      // run paginated search
      return this.twitter.paginatedSearch({
        q,
        since_id,
        lang,
        locale,
        geocode,
        result_type,
        enrichTweets,
        includeReplies,
        includeRetweets,
        maxRequests,
        count,
        limitFirstPage,
      });
    },
  },
};
