import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import { getTweetFields } from "../../common/methods";
import { tweetFieldProps } from "../../common/fieldProps";
import { SearchTweetsParams } from "../../common/types/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-recent";

export default defineAction({
  key: "twitter_v2-serach-tweets",
  name: "Search Tweets",
  description: `Retrieve Tweets from the last seven days that match a query. [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
  type: "action",
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "One query for matching Tweets. See the [Twitter API guide on building queries](https://developer.twitter.com/en/docs/twitter-api/tweets/search/integrate/build-a-query).",
    },
    ...tweetFieldProps,
  },
  methods: {
    getTweetFields,
  },
  async run({ $ }): Promise<object> {
    const params: SearchTweetsParams = {
      $,
      params: {
        query: this.query,
      },
    };

    const response = await this.app.searchTweets(params);
    const { length } = response;

    const summary = length
      ? `Successfully retrieved ${length} tweet${length === 1
        ? ""
        : "s"}`
      : "No tweets found";
    $.export("$summary", summary);

    return response;
  },
});
