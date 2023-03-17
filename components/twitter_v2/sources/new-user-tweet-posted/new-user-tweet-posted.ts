import app from "../../app/twitter_v2.app";
import { defineSource } from "@pipedream/types";
import common from "../common";
import { tweetFieldProps } from "../../common/propGroups";
import { Tweet } from "../../common/types/responseSchemas";
import {
  getUserId, getTweetFields,
} from "../../common/methods";
import { GetUserTweetsParams, ListFollowersParams } from "../../common/types/requestParams";
import { DOCS_LINK, MAX_RESULTS_PER_PAGE } from "../../actions/list-user-tweets/list-user-tweets";

const TWEET_SUMMARY_MAX_LENGTH = 30;

export default defineSource({
  ...common,
  key: "twitter_v2-new-user-tweet-posted",
  name: "New User Tweet Posted",
  description: `Emit new event when the specified user posts a Tweet [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
  type: "source",
  props: {
    app,
    userNameOrId: {
      propDefinition: [
        app,
        "userNameOrId",
      ],
    },
    ...tweetFieldProps,
  },
  methods: {
    ...common.methods,
    getUserId,
    getTweetFields,
    getEntityName() {
      return "Tweet";
    },
    getItemName({ text }: Tweet) {
      return text.length > TWEET_SUMMARY_MAX_LENGTH ? text.slice(0, TWEET_SUMMARY_MAX_LENGTH) + '...' : text;
    },
    async getResources(customize: boolean): Promise<string[]> {
      const params: Partial<GetUserTweetsParams> = {
        $: this,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: MAX_RESULTS_PER_PAGE,
      };

      if (customize) {
        params.userId = this.getUserId();
        params.params = this.getTweetFields();
      }

      return this.app.getUserTweets(params);
    },
  },
});
