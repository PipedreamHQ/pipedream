import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "linear_app-issue-created-instant",
  name: "New Created Issue (Instant)",
  description: "Emit new event when a new issue is created. See the docs [here](https://developers.linear.app/docs/graphql/webhooks)",
  type: "source",
  version: "0.2.3",
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
    getResourcesFn() {
      return this.linearApp.listIssues;
    },
    getResourcesFnArgs() {
      return {
        sortBy: "createdAt",
        filter: {
          project: {
            id: {
              eq: this.projectId,
            },
          },
        },
      };
    },
    getMetadata(resource) {
      const {
        delivery,
        title,
        data,
        createdAt,
      } = resource;
      return {
        id: delivery || resource.id,
        summary: `Issue created: ${data?.title || title}`,
        ts: Date.parse(createdAt),
      };
    },
  },
};
