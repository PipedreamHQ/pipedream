import app from "../../app/twitter_v2.app";
import { defineSource } from "@pipedream/types";
import common from "../common";
import { userFieldProps } from "../../common/propGroups";
import { User } from "../../common/types/responseSchemas";
import {
  getUserId, getUserFields,
} from "../../common/methods";
import { ListFollowersParams } from "../../common/types/requestParams";
import {
  DOCS_LINK, MAX_RESULTS_PER_PAGE,
} from "../../actions/list-followers/list-followers";

export default defineSource({
  ...common,
  key: "twitter_v2-new-follower-received",
  name: "New Follower Received",
  description: `Emit new event when the specified user receives a follower on Twitter [See docs here](${DOCS_LINK})`,
  version: "0.0.1",
  type: "source",
  props: {
    app,
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
    getEntityName() {
      return "Follower";
    },
    getItemName({ name }: User) {
      return name;
    },
    async getResources(customize: boolean): Promise<string[]> {
      const params: Partial<ListFollowersParams> = {
        $: this,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: MAX_RESULTS_PER_PAGE,
      };

      if (customize) {
        params.userId = this.getUserId();
        params.params = this.getUserFields();
      }

      return this.app.listFollowers(params);
    },
  },
});
