import app from "../../app/twitter.app";
import { defineAction } from "@pipedream/types";
import { GetTweetParams } from "../../common/types/requestParams";
import { getTweetFields } from "../../common/methods";
import {
  ResponseObject, Tweet,
} from "../../common/types/responseSchemas";

const DOCS_LINK =
  "https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/api-reference/get-tweets-id";

export default defineAction({
  key: "twitter-get-tweet",
  name: "Get Tweet",
  description: `Return a single tweet specified by ID. [See docs here](${DOCS_LINK})`,
  version: "1.1.2",
  type: "action",
  props: {
    app,
    tweetId: {
      propDefinition: [
        app,
        "tweetId",
      ],
    },
  },
  methods: {
    getTweetFields,
  },
  async run({ $ }): Promise<ResponseObject<Tweet>> {
    const { tweetId } = this;
    const params: GetTweetParams = {
      $,
      params: this.getTweetFields(),
      tweetId,
    };

    const response = await this.app.getTweet(params);

    $.export("$summary", `Successfully retrieved tweet (ID ${tweetId})`);

    return response;
  },
});
