const base = require("../common/tweets");

module.exports = {
  ...base,
  key: "twitter-new-tweet-in-list",
  name: "New Tweet in List",
  description: "Emit new Tweets posted by members of a list",
  version: "0.0.1",
  props: {
    ...base.props,
    includeRetweets: {
      propDefinition: [
        base.props.twitter,
        "includeRetweets",
      ],
    },
    list: {
      type: "string",
      description: "The Twitter list to watch for new Tweets",
      async options(context) {
        const { page } = context;
        if (page !== 0) {
          return [];
        }

        const lists = await this.twitter.getLists();
        return lists.map(({
          name,
          id_str,
        }) => ({
          label: name,
          value: id_str,
        }));
      },
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
        list_id: this.list,
        count: this.count,
        since_id: this.getSinceId(),
        includeEntities: this.includeEntities,
        includeRetweets: this.shouldIncludeRetweets(),
      });
    },
  },
};
