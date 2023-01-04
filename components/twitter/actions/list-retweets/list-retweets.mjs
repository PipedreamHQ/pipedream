import common from "../common.mjs";

export default {
  ...common,
  key: "twitter-list-retweets",
  name: "List Retweets",
  description: "Return a collection of recent retweets of a tweet by ID parameter. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/get-statuses-retweets-id)",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    id: {
      propDefinition: [
        common.props.twitter,
        "tweetID",
      ],
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
  },
  async run({ $ }) {
    const {
      id,
      count,
      maxRequests,
    } = this;

    const params = {
      $,
      id,
      count,
      maxRequests,
    };
    const tweets = await this.paginate(this.twitter.getRetweets.bind(this), params);
    const results = [];
    for await (const tweet of tweets) {
      results.push(tweet);
    }
    $.export("$summary", "Successfully retrieved retweets");
    return results;
  },
};
