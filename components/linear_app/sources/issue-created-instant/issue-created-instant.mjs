import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "linear_app-issue-created-instant",
  name: "New Issue Created (Instant)",
  description: "Triggers instantly when a new issue is created in Linear. Provides complete issue details including title, description, team, assignee, state, and timestamps. Supports filtering by team and project. See Linear docs for additional info [here](https://developers.linear.app/docs/graphql/webhooks).",
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
      return "Issue created";
    },
    getResourcesFn() {
      return this.linearApp.listIssues;
    },
    getResourcesFnArgs() {
      return {
        orderBy: "createdAt",
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
      return body?.action === "create";
    },
    getResource(issue) {
      return this.linearApp.getIssue({
        issueId: issue.id,
      });
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
