import common from "../common/common-flex.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./common-sample-events.mjs";

export default {
  ...common,
  key: "github-new-release",
  name: "New release",
  description: "Emit new event when a new release is created",
  version: "1.0.12",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSampleTimerEvent,
    getSampleWebhookEvent,
    getWebhookEvents() {
      return [
        "release",
      ];
    },
    shouldEmitWebhookEvent(body) {
      return body?.action === "created";
    },
    getWebhookEventItem(body) {
      return body.release;
    },
    getSummary(item) {
      return `New release: "${item.name || item.tag_name}"`;
    },
    getPollingData(args) {
      return this.github.listReleases({
        ...args,
        per_page: 100,
      });
    },
    getHttpDocsLink() {
      return "https://docs.github.com/en/webhooks/webhook-events-and-payloads#release";
    },
    getTimerDocsLink() {
      return "https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28";
    },
  },
};
