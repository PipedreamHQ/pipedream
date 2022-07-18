import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "linear_app-comment-created-instant",
  name: "New Created Comment (Instant)",
  description: "Emit new event when a new comment is created. See the docs [here](https://developers.linear.app/docs/graphql/webhooks)",
  type: "source",
  version: "0.0.3",
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
    getActions() {
      return [
        constants.ACTION.CREATE,
      ];
    },
    getResourcesFn() {
      return this.linearApp.listComments;
    },
    async getLoadedProjectId(event) {
      return event?._project?.id
        || (await this.linearApp.getIssue(event?._issue?.id))?._project?.id;
    },
    getMetadata(resource) {
      const {
        delivery,
        data,
        createdAt,
      } = resource;
      return {
        id: delivery,
        summary: `New comment event created: ${data.body}`,
        ts: Date.parse(createdAt),
      };
    },
  },
};
