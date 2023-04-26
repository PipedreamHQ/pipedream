import app from "../../app/twitter.app";
import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getTweetSummary as getItemSummary } from "../common/getItemSummary";
import { getTweetFields } from "../../common/methods";
import { SearchTweetsParams } from "../../common/types/requestParams";
import { Tweet } from "../../common/types/responseSchemas";
import {
  DOCS_LINK, MAX_RESULTS_PER_PAGE,
} from "../../actions/simple-search/simple-search";

export default defineSource({
  ...common,
  key: "twitter-new-tweet-posted-matching-query",
  name: "New Tweet Posted Matching Query",
  description: `Emit new event when a new tweet matching the specified query is posted [See docs here](${DOCS_LINK})`,
  version: "0.1.2",
  type: "source",
  props: {
    ...common.props,
    query: {
      propDefinition: [
        app,
        "query",
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
      const params: SearchTweetsParams = {
        $: this,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: maxResults ?? MAX_RESULTS_PER_PAGE,
        params: {
          query: this.query,
          ...this.getTweetFields(),
        },
      };

      const { data } = await this.app.searchTweets(params);
      return data;
    },
  },
});
