import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "linear_app-issue-updated-instant",
  name: "Issue Updated (Instant)",
  description: "Triggers instantly when any issue is updated in Linear. Provides complete issue details with changes. Supports filtering by team and project. Includes all updates except status changes. See Linear docs for additional info [here](https://linear.app/developers/webhooks).",
  type: "source",
  version: "0.3.15",
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
