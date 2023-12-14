import app from "../../app/twitter.app";
import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getTweetSummary as getItemSummary } from "../common/getItemSummary";
import { getTweetFields } from "../../common/methods";
import { GetUserMentionsParams } from "../../common/types/requestParams";
import {
  DOCS_LINK, MAX_RESULTS_PER_PAGE,
} from "../../actions/list-mentions/list-mentions";
import { Tweet } from "../../common/types/responseSchemas";
import cacheUserId from "../common/cacheUserId";

export default defineSource({
  ...common,
  key: "twitter-new-mention-received-by-user",
  name: "New Mention Received by User",
  description: `Emit new event when the specified User is mentioned in a Tweet [See the documentation](${DOCS_LINK})`,
  version: "0.0.2",
  type: "source",
  props: {
    ...common.props,
    userNameOrId: {
      propDefinition: [
        app,
        "userNameOrId",
      ],
    },
  },
  methods: {
    ...common.methods,
    ...cacheUserId,
    getTweetFields,
    getItemSummary,
    getEntityName() {
      return "Mention Received";
    },
    async getResources(maxResults?: number): Promise<Tweet[]> {
      const userId = await this.getCachedUserId();
      const params: GetUserMentionsParams = {
        $: this,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: maxResults ?? MAX_RESULTS_PER_PAGE,
        params: this.getTweetFields(),
        userId,
      };

      const { data } = await this.app.getUserMentions(params);
      return data;
    },
  },
});
