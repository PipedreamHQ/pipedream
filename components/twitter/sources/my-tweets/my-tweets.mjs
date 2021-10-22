import base from "../common/tweets.mjs";

export default {
  ...base,
  key: "twitter-my-tweets",
  name: "My Tweets",
  description: "Emit new Tweets you post to Twitter",
  version: "0.0.6",
  type: "source",
  props: {
    ...base.props,
    q: {
      propDefinition: [
        base.props.twitter,
        "keywordFilter",
      ],
    },
    resultType: {
      propDefinition: [
        base.props.twitter,
        "resultType",
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
        resultType,
        enrichTweets,
        includeReplies,
        includeRetweets,
        maxRequests,
        count,
      } = this;
      const sinceId = this.getSinceId();
      const limitFirstPage = !sinceId;
      const q = await this.getSearchQuery();

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
  },
};
