import app from "../../app/twitter_v2.app";
import { defineAction } from "@pipedream/types";

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
    tweetExpansions: {
      propDefinition: [
        app,
        "tweetExpansions",
      ],
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
    const params = {
      $,
      tweetId: this.tweetId,
      params: {
        "expansions": this.tweetExpansions,
        "media.fields": this.mediaFields,
        "place.fields": this.placeFields,
        "poll.fields": this.pollFields,
        "tweet.fields": this.tweetFields,
        "user.fields": this.userFields,
      },
    };

    const response = await this.app.getTweet(params);

    $.export("$summary", "Successfully retrieved tweet");

    return response;
  },
});
