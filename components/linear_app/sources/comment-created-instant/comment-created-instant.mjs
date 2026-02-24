import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "linear_app-comment-created-instant",
  name: "New Comment Created (Instant)",
  description: "Triggers instantly when a new comment is added to an issue in Linear. Returns comment details including content, author, issue reference, and timestamps. Supports filtering by team. See Linear docs for additional info [here](https://linear.app/developers/webhooks).",
  type: "source",
  version: "0.1.17",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceTypes() {
      return [
        constants.RESOURCE_TYPE.COMMENT,
      ];
    },
    getWebhookLabel() {
      return "Comment created";
    },
    getResourcesFn() {
      return this.linearApp.listComments;
    },
    useGraphQl() {
      return false;
    },
    async isFromProject(body) {
      const comment = await this.linearApp.getComment({
        commentId: body.data.id,
      });
      return !this.projectId || comment?.issue?.project?.id == this.projectId;
    },
    getResourcesFnArgs() {
      return {
        sortBy: "createdAt",
        filter: {
          issue: {
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
        },
      };
    },
    getResource(comment) {
      return this.linearApp.getComment({
        commentId: comment.id,
      });
    },
    getMetadata(resource) {
      const {
        delivery,
        body,
        data,
        createdAt,
      } = resource;
      return {
        id: delivery || resource.id,
        summary: `New comment event created: ${data?.body || body}`,
        ts: Date.parse(createdAt),
      };
    },
  },
};
