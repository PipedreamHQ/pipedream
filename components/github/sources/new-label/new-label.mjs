import common from "../common/common-flex.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./common-sample-events.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks/webhook-events-and-payloads#label";

export default {
  ...common,
  key: "github-new-label",
  name: "New Label",
  description: `Emit new event when a new label is created [See the documentation](${DOCS_LINK})`,
  version: "1.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSampleTimerEvent,
    getSampleWebhookEvent,
    getWebhookEvents() {
      return [
        "label",
      ];
    },
    shouldEmitWebhookEvent(body) {
      return body?.action === "created";
    },
    getWebhookEventItem(body) {
      return body.label;
    },
    getSummary(item) {
      return `New label: "${item.name}"`;
    },
    getPollingData(args) {
      return this.github.getRepositoryLatestLabels(args);
    },
  },
};
