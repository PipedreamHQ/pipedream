import base from "../common/tweets.mjs";

export default {
  ...base,
  key: "twitter-new-tweet-in-list",
  name: "New Tweet in List",
  description: "Emit new Tweets posted by members of a list",
  version: "0.0.7",
  type: "source",
  props: {
    ...base.props,
    includeRetweets: {
      propDefinition: [
        base.props.twitter,
        "includeRetweets",
      ],
    },
    list: {
      propDefinition: [
        base.props.twitter,
        "list",
      ],
    },
    includeEntities: {
      type: "boolean",
      label: "Entities",
      description: `
        Include the 'entities' node, which offers a variety of metadata about the
        tweet in a discreet structure, including: user_mentions, urls, and hashtags
      `,
      default: false,
    },
  },
  methods: {
    ...base.methods,
    shouldIncludeRetweets() {
      return this.includeRetweets !== "exclude";
    },
    retrieveTweets() {
      return this.twitter.getListTweets({
        listId: this.list,
        count: this.count,
        sinceId: this.getSinceId(),
        includeEntities: this.includeEntities,
        includeRetweets: this.shouldIncludeRetweets(),
      });
    },
  },
};
