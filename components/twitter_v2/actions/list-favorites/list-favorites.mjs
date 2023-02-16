import common from "../common.mjs";

export default {
  ...common,
  key: "twitter-list-favorites",
  name: "List Favorites",
  description: "Return the most recent tweets liked by you or the specified user. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/get-favorites-list)",
  version: "0.0.2",
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
      description: "Specifies the number of records to retrieve. Must be less than or equal to `200`; defaults to `20`.",
      optional: true,
      default: 20,
    },
    maxRequests: {
      propDefinition: [
        common.props.twitter,
        "maxRequests",
      ],
    },
    includeEntities: {
      propDefinition: [
        common.props.twitter,
        "includeEntities",
      ],
    },
  },
  async run({ $ }) {
    const {
      screenName,
      count,
      maxRequests,
      includeEntities,
    } = this;

    const params = {
      $,
      screenName,
      count,
      maxRequests,
      include_entities: includeEntities,
    };
    const tweets = await this.paginate(this.twitter.getLikedTweets.bind(this), params);
    const results = [];
    for await (const tweet of tweets) {
      results.push(tweet);
    }
    $.export("$summary", "Successfully retrieved favorites");
    return results;
  },
};
