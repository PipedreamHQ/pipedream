import app from "../../app/twitter_v2.app";
import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getTweetSummary as getItemSummary } from "../common/getItemSummary";
import { tweetFieldProps } from "../../common/propGroups";
import {
  getUserId, getTweetFields,
} from "../../common/methods";
import { GetListTweetsParams } from "../../common/types/requestParams";
import { Tweet } from "../../common/types/responseSchemas";

const DOCS_LINK = "https://developer.twitter.com/en/docs/twitter-api/lists/list-tweets/api-reference/get-lists-id-tweets";
const MAX_RESULTS_PER_PAGE = 100;

export default defineSource({
  ...common,
  key: "twitter_v2-new-tweet-posted-in-list",
  name: "New Tweet Posted In List",
  description: `Emit new event for each new tweet posted in the specified list [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        app,
        "listId",
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
    getItemSummary,
    async getResources(customize: boolean): Promise<Tweet[]> {
      const params: GetListTweetsParams = {
        $: this,
        listId: this.listId,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: MAX_RESULTS_PER_PAGE,
      };

      if (customize) {
        params.params = this.getTweetFields();
      }

      return this.app.getListTweets(params);
    },
  },
});
