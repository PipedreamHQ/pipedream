import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "linear_app-issue-created-instant",
  name: "New Created Issue (Instant)",
  description: "Emit new event when a new issue is created. See the docs [here](https://developers.linear.app/docs/graphql/webhooks)",
  type: "source",
  version: "0.1.0",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceTypes() {
      return [
        constants.RESOURCE_TYPE.ISSUE,
      ];
    },
    getWebhookLabel() {
      return "Issue created";
    },
    getActions() {
      return [
        constants.ACTION.CREATE,
      ];
    },
    getMetadata(resource) {
      const {
        delivery,
        data,
        createdAt,
      } = resource;
      return {
        id: delivery,
        summary: `Issue created: ${data.title}`,
        ts: Date.parse(createdAt),
      };
    },
  },
};
