import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "linear_app-issue-updated-instant",
  name: "New Updated Issue (Instant)",
  description: "Emit new event when an issue is updated. See the docs [here](https://developers.linear.app/docs/graphql/webhooks)",
  type: "source",
  version: "0.2.1",
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
    getActions() {
      return [
        constants.ACTION.UPDATE,
      ];
    },
    getResourcesFn() {
      return this.linearApp.listIssues;
    },
    async getLoadedProjectId(event) {
      return event?._project?.id
        || (await this.linearApp.getIssue(event?.id))?._project?.id ;
    },
    async isRelevant(body) {
      const projectIdSet = await this.linearApp.isProjectIdSet(body, this.projectId);
      if (!this.linearApp.isActionSet(body, this.getActions())) {
        return false;
      }
      if (!projectIdSet) {
        return false;
      }
      return true;
    },
    getMetadata(resource) {
      const {
        delivery,
        data,
        updatedAt,
      } = resource;
      return {
        id: delivery,
        summary: `Issue Updated: ${data.title}`,
        ts: Date.parse(updatedAt),
      };
    },
  },
};
