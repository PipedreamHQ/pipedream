import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "linear_app-new-issue-status-updated",
  name: "New Issue Status Updated (Instant)",
  description: "Emit new event when the status of an issue is updated. See the docs [here](https://developers.linear.app/docs/graphql/webhooks)",
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
      return "Issue status updated";
    },
    getResourcesFn() {
      return this.linearApp.listIssues;
    },
    getResourcesFnArgs() {
      return {
        sortBy: "updatedAt",
        filter: {
          team: {
            id: {
              in: this.teamIds,
            },
          },
          project: {
            id: {
              eq: this.projectId,
            },
          },
        },
      };
    },
    isRelevant(body) {
      return body?.updatedFrom?.stateId;
    },
    getMetadata(resource) {
      const {
        delivery,
        title,
        data,
        updatedAt,
      } = resource;
      return {
        id: delivery || resource.id,
        summary: `Issue status updated: ${data?.title || title}`,
        ts: Date.parse(updatedAt),
      };
    },
  },
};
