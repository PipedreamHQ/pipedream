import app from "../../app/twitter_v2.app";
import { defineSource } from "@pipedream/types";
import common from "../common/base";
import { getTweetSummary as getItemSummary } from "../common/getItemSummary";
import { tweetFieldProps } from "../../common/propGroups";
import { Tweet } from "../../common/types/responseSchemas";
import {
  getUserId, getTweetFields,
} from "../../common/methods";
import { GetUserTweetsParams } from "../../common/types/requestParams";
import {
  DOCS_LINK, MAX_RESULTS_PER_PAGE,
} from "../../actions/list-user-tweets/list-user-tweets";

export default defineSource({
  ...common,
  key: "twitter_v2-new-tweet-posted-by-user",
  name: "New Tweet Posted by User",
  description: `Emit new event when the specified User posts a Tweet [See docs here](${DOCS_LINK})`,
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
    ...tweetFieldProps,
  },
  methods: {
    ...common.methods,
    getUserId,
    getTweetFields,
    getItemSummary,
    getEntityName() {
      return "Tweet";
    },
    getLastEntityId(): string {
      return this.db.get("lastEntityId");
    },
    setLastEntityId(data: string) {
      this.db.set("lastEntityId", data);
    },
    async getAndProcessData(emit = false) {
      const data: Tweet[] = await this.getResources(emit);
      if (data) {
        const latestId = data[0].id;
        this.setLastEntityId(latestId);

        if (emit) {
          data.reverse().forEach((obj) => {
            this.emitEvent(obj);
          });
        }
      }
    },
    async getResources(customize: boolean): Promise<Tweet[]> {
      const params: GetUserTweetsParams = {
        $: this,
        maxPerPage: MAX_RESULTS_PER_PAGE,
        maxResults: MAX_RESULTS_PER_PAGE,
        userId: this.getUserId(),
      };

      const sinceId = this.getLastEntityId();
      if (sinceId) params.params = {
        since_id: sinceId,
      };

      if (customize) {
        params.params = {
          ...params.params,
          ...this.getTweetFields(),
        };
      }

      return this.app.getUserTweets(params);
    },
  },
});
