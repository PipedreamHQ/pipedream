import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";
import { TWEET_EXPANSION_OPTIONS } from "../../common/expansions";
import { GetTweetParams } from "../../common/requestParams";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/api-reference/get-tweets-id";

export default defineAction({
  key: "twitter_v2-get-tweet",
  name: "Get Tweet",
  description: `Return a single tweet specified by ID. [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
  type: "action",
  props: {
    app,
    tweetId: {
      propDefinition: [
        app,
        "tweetId",
      ],
    },
    expansions: {
      propDefinition: [
        app,
        "expansions",
      ],
      options: TWEET_EXPANSION_OPTIONS,
    },
    mediaFields: {
      propDefinition: [
        app,
        "mediaFields",
      ],
    },
    placeFields: {
      propDefinition: [
        app,
        "placeFields",
      ],
    },
    pollFields: {
      propDefinition: [
        app,
        "pollFields",
      ],
    },
    tweetFields: {
      propDefinition: [
        app,
        "tweetFields",
      ],
    },
    userFields: {
      propDefinition: [
        app,
        "userFields",
      ],
    },
  },
  async run({ $ }): Promise<object> {
    const params: GetTweetParams = {
      $,
      tweetId: this.tweetId,
      params: {
        "expansions": this.expansions?.join(),
        "media.fields": this.mediaFields?.join(),
        "place.fields": this.placeFields?.join(),
        "poll.fields": this.pollFields?.join(),
        "tweet.fields": this.tweetFields?.join(),
        "user.fields": this.userFields?.join(),
      },
    };

    const response = await this.app.getTweet(params);

    $.export("$summary", "Successfully retrieved tweet");

    return response;
  },
});
