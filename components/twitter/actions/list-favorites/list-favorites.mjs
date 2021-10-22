import common from "../common.mjs";

export default {
  ...common,
  key: "twitter-list-favorites",
  name: "List Favorites",
  description: "Return the most recent tweets liked by you or the specified user",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    screenName: {
      propDefinition: [
        common.props.twitter,
        "screenName",
      ],
    },
    count: {
      propDefinition: [
        common.props.twitter,
        "count",
      ],
      description: "Specifies the number of records to retrieve. Must be less than or equal to 200; defaults to 20.",
      optional: true,
      default: 20,
    },
    includeEntities: {
      propDefinition: [
        common.props.twitter,
        "includeEntities",
      ],
    },
  },
  async run() {
    const {
      screenName,
      count,
      includeEntities,
    } = this;

    const params = {
      screenName,
      count,
      include_entities: includeEntities,
    };
    const tweets = await this.paginate(this.twitter.getLikedTweets.bind(this), params);
    const results = [];
    for await (const tweet of tweets) {
      results.push(tweet);
    }
    return results;
  },
};
