import app from "../../app/twitter.app";
import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getUserSummary as getItemSummary } from "../common/getItemSummary";
import { getUserFields } from "../../common/methods";
import { GetUserFollowersParams } from "../../common/types/requestParams";
import {
  DOCS_LINK, MAX_RESULTS_PER_PAGE,
} from "../../actions/list-followers/list-followers";
import { User } from "../../common/types/responseSchemas";
import cacheUserId from "../common/cacheUserId";

export default defineSource({
  ...common,
  key: "twitter-new-follower-of-user",
  name: "New Follower Received by User",
  description: `Emit new event when the specified User receives a Follower [See docs here](${DOCS_LINK})`,
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
    getItemSummary,
    getEntityName() {
      return "Follower";
    },
    async getResources(maxResults?: number): Promise<User[]> {
      const userId = await this.getCachedUserId();
      const params: GetUserFollowersParams = {
        $: this,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: maxResults ?? MAX_RESULTS_PER_PAGE,
        params: this.getUserFields(),
        userId,
      };

      const { data } = await this.app.getUserFollowers(params);
      return data;
    },
  },
});
