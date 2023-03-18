import app from "../../app/twitter_v2.app";
import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getTweetSummary as getItemSummary } from "../common/getItemSummary";
import { tweetFieldProps } from "../../common/propGroups";
import {
  getUserId, getTweetFields,
} from "../../common/methods";
import { GetUserLikedTweetParams } from "../../common/types/requestParams";
import {
  DOCS_LINK, MAX_RESULTS_PER_PAGE,
} from "../../actions/list-favorites/list-favorites";
import { Tweet } from "../../common/types/responseSchemas";

export default defineSource({
  ...common,
  key: "twitter_v2-new-tweet-liked-by-user",
  name: "New Tweet Liked By User",
  description: `Emit new event when the specified user follows another user [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
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
    getItemSummary,
    getEntityName() {
      return "Tweet Liked";
    },
    async getResources(customize: boolean): Promise<Tweet[]> {
      const params: Partial<GetUserLikedTweetParams> = {
        $: this,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: MAX_RESULTS_PER_PAGE,
        userId: this.getUserId(),
      };

      if (customize) {
        params.params = this.getTweetFields();
      }

      return this.app.getUserLikedTweets(params);
    },
  },
});
