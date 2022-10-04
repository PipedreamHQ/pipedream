import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "linear_app-comment-created-instant",
  name: "New Created Comment (Instant)",
  description: "Emit new event when a new comment is created. See the docs [here](https://developers.linear.app/docs/graphql/webhooks)",
  type: "source",
  version: "0.0.4",
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
    getResourcesFnArgs() {
      return {
        sortBy: "createdAt",
        filter: {
          issue: {
            project: {
              id: {
                eq: this.projectId,
              },
            },
          },
        },
      };
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
