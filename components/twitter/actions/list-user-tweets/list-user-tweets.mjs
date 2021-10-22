import common from "../common.mjs";

export default {
  ...common,
  key: "twitter-list-user-tweets",
  name: "List User Tweets",
  description: "Return a collection of the most recent tweets posted by a user",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    screenName: {
      propDefinition: [
        common.props.twitter,
        "screenName",
      ],
      optional: true,
    },
    count: {
      propDefinition: [
        common.props.twitter,
        "count",
      ],
      optional: true,
      default: 20,
    },
    includeRetweets: {
      propDefinition: [
        common.props.twitter,
        "includeRetweets",
      ],
    },
    includeReplies: {
      propDefinition: [
        common.props.twitter,
        "includeReplies",
      ],
    },
  },
  methods: {
    ...common.methods,
    shouldExcludeReplies(includeReplies) {
      return includeReplies === "exclude";
    },
    shouldIncludeRetweets(includeRetweets) {
      return includeRetweets !== "exclude";
    },
  },
  async run() {
    const {
      screenName,
      count,
      includeRetweets,
      includeReplies,
    } = this;

    const params = {
      screenName,
      count,
      exclude_replies: this.shouldExcludeReplies(includeReplies),
      include_rts: this.shouldIncludeRetweets(includeRetweets),
    };
    const tweets = await this.paginate(this.twitter.getUserTimeline.bind(this), params);
    const results = [];
    for await (const tweet of tweets) {
      results.push(tweet);
    }
    return results;
  },
};
