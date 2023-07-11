import app from "../../app/twitter.app";
import { ACTION_ERROR_MESSAGE } from "../../common/errorMessage";
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
  description: `Return a single tweet specified by ID. [See the documentation](${DOCS_LINK})`,
  version: "2.0.3",
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
    try {
      const { tweetId } = this;
      const params: GetTweetParams = {
        $,
        params: this.getTweetFields(),
        tweetId,
      };

      const response = await this.app.getTweet(params);

      $.export("$summary", `Successfully retrieved tweet (ID ${tweetId})`);

      return response;
    } catch (err) {
      $.export("error", err);
      throw new Error(ACTION_ERROR_MESSAGE);
    }
  },
});
