import app from "../../app/twitter.app";
import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getTweetSummary as getItemSummary } from "../common/getItemSummary";
import { getTweetFields } from "../../common/methods";
import { GetListTweetsParams } from "../../common/types/requestParams";
import { Tweet } from "../../common/types/responseSchemas";
import {
  DOCS_LINK, MAX_RESULTS_PER_PAGE,
} from "../../actions/simple-search-in-list/simple-search-in-list";

export default defineSource({
  ...common,
  key: "twitter-new-tweet-in-list",
  name: "New Tweet Posted in List",
  description: `Emit new event when a Tweet is posted in the specified list [See docs here](${DOCS_LINK})`,
  version: "1.1.2",
  type: "source",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        app,
        "listId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getTweetFields,
    getEntityName() {
      return "Tweet";
    },
    getItemSummary,
    async getResources(maxResults?: number): Promise<Tweet[]> {
      const params: GetListTweetsParams = {
        $: this,
        listId: this.listId,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: maxResults ?? MAX_RESULTS_PER_PAGE,
        params: this.getTweetFields(),
      };

      const { data } = await this.app.getListTweets(params);
      return data;
    },
  },
});
