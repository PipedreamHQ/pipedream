import app from "../../app/twitter_v2.app";
import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getTweetSummary as getItemSummary } from "../common/getItemSummary";
import { tweetFieldProps } from "../../common/propGroups";
import { getTweetFields } from "../../common/methods";
import { GetUserLikedTweetParams } from "../../common/types/requestParams";
import {
  DOCS_LINK, MAX_RESULTS_PER_PAGE,
} from "../../actions/list-liked-tweets/list-liked-tweets";
import { Tweet } from "../../common/types/responseSchemas";
import cacheUserId from "../common/cacheUserId";

export default defineSource({
  ...common,
  key: "twitter_v2-new-tweet-liked-by-user",
  name: "New Tweet Liked by User",
  description: `Emit new event when a Tweet is liked by the specified User [See docs here](${DOCS_LINK})`,
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
    ...cacheUserId,
    getTweetFields,
    getItemSummary,
    getEntityName() {
      return "Tweet Liked";
    },
    async getResources(customize: boolean): Promise<Tweet[]> {
      const userId = await this.getCachedUserId();
      const params: GetUserLikedTweetParams = {
        $: this,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: MAX_RESULTS_PER_PAGE,
        userId,
      };

      if (customize) {
        params.params = this.getTweetFields();
      }

      const { data } = await this.app.getUserLikedTweets(params);
      return data;
    },
  },
});
