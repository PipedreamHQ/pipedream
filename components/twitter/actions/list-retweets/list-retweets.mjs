import common from "../common.mjs";

export default {
  ...common,
  key: "twitter-list-retweets",
  name: "List Retweets",
  description: "Return a collection of recent retweets of a tweet by ID parameter",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    tweetID: {
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
  },
  async run() {
    const {
      tweetID,
      count,
    } = this;

    const params = {
      id: tweetID,
      count,
    };
    const tweets = await this.paginate(this.twitter.getRetweets.bind(this), params);
    const results = [];
    for await (const tweet of tweets) {
      results.push(tweet);
    }
    return results;
  },
};
