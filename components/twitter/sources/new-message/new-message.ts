import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getTweetSummary as getItemSummary } from "../common/getItemSummary";
import { getMessageFields } from "../../common/methods";
import { GetDirectMessagesParams } from "../../common/types/requestParams";
import { DirectMessage } from "../../common/types/responseSchemas";

const DOCS_LINK = "https://developer.twitter.com/en/docs/twitter-api/direct-messages/lookup/api-reference/get-dm_events";
const MAX_RESULTS_PER_PAGE = 100;

export default defineSource({
  ...common,
  key: "twitter-new-message",
  name: "New Message Received",
  description: `Emit new event when a new Direct Message (DM) is received [See the documentation](${DOCS_LINK})`,
  version: "1.0.4",
  type: "source",
  methods: {
    ...common.methods,
    getMessageFields,
    getEntityName() {
      return "DM Received";
    },
    getItemSummary,
    async getResources(maxResults?: number): Promise<DirectMessage[]> {
      const params: GetDirectMessagesParams = {
        $: this,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: maxResults ?? MAX_RESULTS_PER_PAGE,
        params: {
          ...this.getMessageFields(),
          event_types: "MessageCreate",
        },
      };

      const { data } = await this.app.getDirectMessages(params);
      return data;
    },
  },
});
