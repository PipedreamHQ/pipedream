import common from "../common/common-flex.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./common-sample-events.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks/webhook-events-and-payloads#create";

export default {
  ...common,
  key: "github-new-branch",
  name: "New Branch",
  description: `Emit new event when a branch is created [See the documentation](${DOCS_LINK})`,
  version: "1.0.4",
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
  },
};
