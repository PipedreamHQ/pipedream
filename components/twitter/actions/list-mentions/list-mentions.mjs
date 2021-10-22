import common from "../common.mjs";

export default {
  ...common,
  key: "twitter-list-mentions",
  name: "List Mentions",
  description: "Return the 20 most recent mentions for the authenticated user",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
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
      count,
      includeEntities,
    } = this;

    const params = {
      count,
      includeEntities,
    };
    const tweets = await this.paginate(this.twitter.getMentionsTimeline.bind(this), params);
    const results = [];
    for await (const tweet of tweets) {
      results.push(tweet);
    }
    return results;
  },
};
