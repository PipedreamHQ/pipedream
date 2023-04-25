import app from "../../app/twitter.app";
import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getUserSummary as getItemSummary } from "../common/getItemSummary";
import {
  DOCS_LINK,
  MAX_RESULTS_PER_PAGE,
} from "../../actions/list-followers/list-followers";
import { User } from "../../common/types/responseSchemas";
import { GetUserFollowersParams } from "../../common/types/requestParams";
import cacheUserId from "../common/cacheUserId";

export default defineSource({
  ...common,
  key: "twitter-new-unfollower-of-user",
  name: "New Unfollower of User",
  description: `Emit new event when the specified User loses a Follower [See docs here](${DOCS_LINK})`,
  version: "1.0.3",
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
    getItemSummary,
    getEntityName() {
      return "Unfollower";
    },
    getSavedUsers(): User[] {
      return this.db.get("savedUsers");
    },
    setSavedUsers(data: User[]) {
      this.db.set("savedUsers", data);
    },
    async getResources(): Promise<User[]> {
      const userId = await this.getCachedUserId();
      const params: GetUserFollowersParams = {
        $: this,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: MAX_RESULTS_PER_PAGE,
        userId,
      };

      const { data } = await this.app.getUserFollowers(params);
      return data;
    },
    async getAndProcessData(emit = false) {
      const data: User[] = await this.getResources(emit);
      if (data) {
        let savedUsers: User[] = this.getSavedUsers();
        if (savedUsers && emit) {
          const currentFollowerIds = data.map(({ id }) => id);

          if (data.length === MAX_RESULTS_PER_PAGE) {
            const lastKnownFollower = Array.from(data)
              .reverse() // could be .findLast in Node 18+
              .find(({ id }) => currentFollowerIds.includes(id));
            const lastKnownIndex = savedUsers.indexOf(lastKnownFollower);
            savedUsers = savedUsers.slice(0, lastKnownIndex + 1);
          }

          savedUsers
            .filter(({ id }) => !currentFollowerIds.includes(id))
            .reverse()
            .forEach((obj) => {
              if (emit) this.emitEvent(obj);
            });
        }

        this.setSavedUsers(data.map(({
          id, username,
        }) => ({
          id,
          username,
        })));
      }
    },
  },
});
