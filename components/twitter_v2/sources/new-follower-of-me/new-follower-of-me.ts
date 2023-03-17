import app from "../../app/twitter_v2.app";
import { defineSource } from "@pipedream/types";
import common from "../common";
import { userFieldProps } from "../../common/propGroups";

const DOCS_LINK = "https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/get-users-id-followers";

export default defineSource({
  ...common,
  key: "twitter_v2-new-follower",
  name: "New Follower Received",
  description: `Emit new event when a user receives a follower on Twitter [See docs here](${DOCS_LINK})`,
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
    getEntityName() {
      return "Follower";
    },
    async getResources(): Promise<string[]> {
      const { domain } = this;

      return this.app.listKeywords(domain);
    },
  },
});
