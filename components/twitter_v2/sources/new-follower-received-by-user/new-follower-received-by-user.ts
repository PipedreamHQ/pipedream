import app from "../../app/twitter_v2.app";
import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getUserSummary as getItemSummary } from "../common/getItemSummary";
import { userFieldProps } from "../../common/propGroups";
import {
  getUserId, getUserFields,
} from "../../common/methods";
import { GetUserFollowersParams } from "../../common/types/requestParams";
import {
  DOCS_LINK, MAX_RESULTS_PER_PAGE,
} from "../../actions/list-followers/list-followers";
import { User } from "../../common/types/responseSchemas";

export default defineSource({
  ...common,
  key: "twitter_v2-new-follower-received-by-user",
  name: "New Follower Received By User",
  description: `Emit new event when the specified user receives a follower [See docs here](${DOCS_LINK})`,
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
    getUserId,
    getUserFields,
    getItemSummary,
    getEntityName() {
      return "Follower";
    },
    async getResources(customize: boolean): Promise<User[]> {
      const params: Partial<GetUserFollowersParams> = {
        $: this,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: MAX_RESULTS_PER_PAGE,
      };

      if (customize) {
        params.userId = this.getUserId();
        params.params = this.getUserFields();
      }

      return this.app.getUserFollowers(params);
    },
  },
});
