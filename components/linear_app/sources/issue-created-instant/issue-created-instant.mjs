import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "linear_app-issue-created-instant",
  name: "New Created Issue (Instant)",
  description: "Emit new event when a new issue is created. See the docs [here](https://developers.linear.app/docs/graphql/webhooks)",
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
      return "Issue created";
    },
    getActions() {
      return [
        constants.ACTION.CREATE,
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
        createdAt,
      } = resource;
      return {
        id: delivery,
        summary: `Issue created: ${data.title}`,
        ts: Date.parse(createdAt),
      };
    },
  },
};
