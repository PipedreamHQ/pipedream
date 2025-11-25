import common from "../common/common-flex.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./common-sample-events.mjs";

export default {
  ...common,
  key: "github-new-branch",
  name: "New Branch Created",
  description: "Emit new event when a branch is created.",
  version: "1.0.12",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSampleTimerEvent,
    getSampleWebhookEvent,
    getWebhookEvents() {
      return [
        "create",
      ];
    },
    shouldEmitWebhookEvent(body) {
      return body?.ref_type === "branch";
    },
    getId(item) {
      return item.ref ?? item.name;
    },
    getSummary(item) {
      return `New branch: ${this.getId(item)}`;
    },
    getPollingData(args) {
      return this.github.getBranches(args);
    },
    getHttpDocsLink() {
      return "https://docs.github.com/en/webhooks/webhook-events-and-payloads#create";
    },
    getTimerDocsLink() {
      return "https://docs.github.com/en/rest/branches/branches?apiVersion=2022-11-28#list-branches";
    },
  },
};
