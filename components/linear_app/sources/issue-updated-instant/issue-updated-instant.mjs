import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "linear_app-issue-updated-instant",
  name: "New Updated Issue (Instant)",
  description: "Emit new event when an issue is updated. [See the documentation](https://developers.linear.app/docs/graphql/webhooks)",
  type: "source",
  version: "0.3.10",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceTypes() {
      return [
        constants.RESOURCE_TYPE.ISSUE,
      ];
    },
    getWebhookLabel() {
      return "Issue updated";
    },
    getResourcesFn() {
      return this.linearApp.listIssues;
    },
    getResourcesFnArgs() {
      return {
        orderBy: "updatedAt",
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
    getResource(issue) {
      return this.linearApp.getIssue({
        issueId: issue.id,
      });
    },
    getMetadata(resource) {
      const {
        title,
        data,
        updatedAt,
      } = resource;
      const ts = Date.parse(data?.updatedAt || updatedAt);
      return {
        id: `${resource.id}-${ts}`,
        summary: `Issue Updated: ${data?.title || title}`,
        ts,
      };
    },
  },
};
