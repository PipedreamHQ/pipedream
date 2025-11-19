import common from "../common/common-flex.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./common-sample-events.mjs";

export default {
  ...common,
  key: "github-new-collaborator",
  name: "New Collaborator",
  description: "Emit new event when a collaborator is added",
  version: "1.0.12",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSampleTimerEvent,
    getSampleWebhookEvent,
    getWebhookEvents() {
      return [
        "member",
      ];
    },
    shouldEmitWebhookEvent(body) {
      return body?.action === "added";
    },
    getWebhookEventItem(body) {
      return body.member;
    },
    getSummary(item) {
      return `New collaborator: ${item.login}`;
    },
    getPollingData(args) {
      return this.github.getRepositoryLatestCollaborators(args);
    },
    getHttpDocsLink() {
      return "https://docs.github.com/en/webhooks/webhook-events-and-payloads#member";
    },
    getTimerDocsLink() {
      return "https://docs.github.com/en/rest/collaborators/collaborators?apiVersion=2022-11-28#list-repository-collaborators";
    },
  },
};
