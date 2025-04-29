import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "linear_app-issue-created-instant",
  name: "New Created Issue (Instant)",
  description: "Emit new event when a new issue is created. [See the documentation](https://developers.linear.app/docs/graphql/webhooks)",
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
