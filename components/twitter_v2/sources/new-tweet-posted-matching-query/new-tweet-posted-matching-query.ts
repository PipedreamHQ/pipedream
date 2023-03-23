import app from "../../app/twitter_v2.app";
import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getTweetSummary as getItemSummary } from "../common/getItemSummary";
import { tweetFieldProps } from "../../common/propGroups";
import { getTweetFields } from "../../common/methods";
import { SearchTweetsParams } from "../../common/types/requestParams";
import { Tweet } from "../../common/types/responseSchemas";
import {
  DOCS_LINK, MAX_RESULTS_PER_PAGE,
} from "../../actions/search-tweets/search-tweets";

export default defineSource({
  ...common,
  key: "twitter_v2-new-tweet-matching-query",
  name: "New Tweet Posted Matching Query",
  description: `Emit new event when a new tweet matching the specified query is posted [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    ...tweetFieldProps,
  },
  methods: {
    ...common.methods,
    getTweetFields,
    getEntityName() {
      return "Tweet";
    },
    getItemSummary,
    async getResources(customize: boolean): Promise<Tweet[]> {
      const params: SearchTweetsParams = {
        $: this,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: MAX_RESULTS_PER_PAGE,
        params: {
          query: this.query,
        },
      };

      if (customize) {
        params.params = {
          ...params.params,
          ...this.getTweetFields(),
        };
      }

      const { data } = await this.app.searchTweets(params);
      return data;
    },
  },
});
