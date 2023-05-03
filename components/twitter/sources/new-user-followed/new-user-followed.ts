import app from "../../app/twitter.app";
import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getUserSummary as getItemSummary } from "../common/getItemSummary";
import { getUserFields } from "../../common/methods";
import { GetUserFollowingParams } from "../../common/types/requestParams";
import { User } from "../../common/types/responseSchemas";
import cacheUserId from "../common/cacheUserId";

const DOCS_LINK = "https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/get-users-id-following";
const MAX_RESULTS_PER_PAGE = 1000;

export default defineSource({
  ...common,
  key: "twitter-new-user-followed",
  name: "New User Followed by User",
  description: `Emit new event when the specified User follows another User [See docs here](${DOCS_LINK})`,
  version: "1.1.2",
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
    getUserFields,
    getEntityName() {
      return "User Followed";
    },
    getItemSummary,
    async getResources(maxResults?: number): Promise<User[]> {
      const userId = await this.getCachedUserId();
      const params: GetUserFollowingParams = {
        $: this,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: maxResults ?? MAX_RESULTS_PER_PAGE,
        params: this.getUserFields(),
        userId,
      };

      const { data } = await this.app.getUserFollowing(params);
      return data;
    },
  },
});
