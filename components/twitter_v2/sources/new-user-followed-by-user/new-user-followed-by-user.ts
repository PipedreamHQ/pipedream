import app from "../../app/twitter_v2.app";
import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getUserSummary as getItemSummary } from "../common/getItemSummary";
import { userFieldProps } from "../../common/propGroups";
import { getUserFields } from "../../common/methods";
import { GetUserFollowingParams } from "../../common/types/requestParams";
import { User } from "../../common/types/responseSchemas";
import cacheUserId from "../common/cacheUserId";

const DOCS_LINK = "https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/get-users-id-following";
const MAX_RESULTS_PER_PAGE = 1000;

export default defineSource({
  ...common,
  key: "twitter_v2-new-user-followed-by-user",
  name: "New User Followed by User",
  description: `Emit new event when the specified User follows another User [See docs here](${DOCS_LINK})`,
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
    ...userFieldProps,
  },
  methods: {
    ...common.methods,
    ...cacheUserId,
    getUserFields,
    getEntityName() {
      return "User Followed";
    },
    getItemSummary,
    async getResources(customize: boolean): Promise<User[]> {
      const userId = await this.getCachedUserId();
      const params: GetUserFollowingParams = {
        $: this,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: MAX_RESULTS_PER_PAGE,
        userId,
      };

      if (customize) {
        params.params = this.getUserFields();
      }

      const { data } = await this.app.getUserFollowing(params);
      return data;
    },
  },
});
