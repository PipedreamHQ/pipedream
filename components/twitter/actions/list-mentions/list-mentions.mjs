import common from "../common.mjs";

export default {
  ...common,
  key: "twitter-list-mentions",
  name: "List Mentions",
  description: "Return the 20 most recent mentions for the authenticated user. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-mentions_timeline)",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
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
      count,
      maxRequests,
      includeEntities,
    } = this;

    const params = {
      $,
      count,
      maxRequests,
      includeEntities,
    };
    const tweets = await this.paginate(this.twitter.getMentionsTimeline.bind(this), params);
    const results = [];
    for await (const tweet of tweets) {
      results.push(tweet);
    }
    $.export("$summary", "Sucessfully retrieved mentions");
    return results;
  },
};
