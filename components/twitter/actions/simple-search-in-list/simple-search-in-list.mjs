import twitter from "../../twitter.app.mjs";

export default {
  key: "twitter-simple-search-in-list",
  name: "Simple Search in List",
  description: "Return Tweets that match your search criteria in a specific list. [See the docs here](https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/create-manage-lists/api-reference/get-lists-statuses)",
  version: "0.0.2",
  type: "action",
  props: {
    twitter,
    listId: {
      propDefinition: [
        twitter,
        "list",
      ],
    },
    query: {
      propDefinition: [
        twitter,
        "q",
      ],
    },
    includeRetweets: {
      propDefinition: [
        twitter,
        "includeRetweets",
      ],
    },
    includeEntities: {
      type: "boolean",
      label: "Entities",
      description: "Include the 'entities' node, which offers a variety of metadata about the tweet in a discreet structure, including: user_mentions, urls, and hashtags",
      default: false,
    },
  },
  async run({ $ }) {
    let tweets = await this.twitter.getPaginateListTweets({
      listId: this.listId,
      includeEntities: this.includeEntities,
      includeRetweets: this.includeRetweets !== "exclude",
    });
    tweets = tweets.filter((tweet) => tweet?.full_text?.includes(this.query));
    $.export("$summary", `${tweets.length} search ${tweets.length === 1
      ? "result has"
      : "results have"} been found.`);
    return tweets;
  },
};
