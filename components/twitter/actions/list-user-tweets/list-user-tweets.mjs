import common from "../common.mjs";

export default {
  ...common,
  key: "twitter-list-user-tweets",
  name: "List User Tweets",
  description: "Return a collection of the most recent tweets posted by a user. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline)",
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
    maxRequests: {
      propDefinition: [
        common.props.twitter,
        "maxRequests",
      ],
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
  async run({ $ }) {
    const {
      screenName,
      count,
      maxRequests,
      includeRetweets,
      includeReplies,
    } = this;

    const params = {
      $,
      screenName,
      count,
      maxRequests,
      exclude_replies: this.shouldExcludeReplies(includeReplies),
      include_rts: this.shouldIncludeRetweets(includeRetweets),
    };
    const tweets = await this.paginate(this.twitter.getUserTimeline.bind(this), params);
    const results = [];
    for await (const tweet of tweets) {
      results.push(tweet);
    }
    $.export("$summary", "Successfully retrieved user tweets");
    return results;
  },
};
