import app from "../../app/twitter.app";
import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getListSummary as getItemSummary } from "../common/getItemSummary";
import { listFieldProps } from "../../common/propGroups";
import { List } from "../../common/types/responseSchemas";
import { getListFields } from "../../common/methods";
import { GetUserFollowedListsParams } from "../../common/types/requestParams";
import cacheUserId from "../common/cacheUserId";

const DOCS_LINK = "https://developer.twitter.com/en/docs/twitter-api/lists/list-follows/api-reference/get-users-id-followed_lists";
const MAX_RESULTS_PER_PAGE = 100;

export default defineSource({
  ...common,
  key: "twitter-new-list-followed-by-user",
  name: "New List Followed by User",
  description: `Emit new event when the specified User follows a List [See docs here](${DOCS_LINK})`,
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
    ...listFieldProps,
  },
  methods: {
    ...common.methods,
    ...cacheUserId,
    getListFields,
    getItemSummary,
    getEntityName() {
      return "List Followed";
    },
    async getResources(customize: boolean): Promise<List[]> {
      const userId = await this.getCachedUserId();
      const params: GetUserFollowedListsParams = {
        $: this,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: MAX_RESULTS_PER_PAGE,
        userId,
      };

      if (customize) {
        params.params = this.getListFields();
      }

      const { data } = await this.app.getUserFollowedLists(params);
      return data;
    },
  },
});
