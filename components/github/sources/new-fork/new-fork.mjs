import common from "../common/common-flex.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./common-sample-events.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks/webhook-events-and-payloads#fork";

export default {
  ...common,
  key: "github-new-fork",
  name: "New Fork",
  description: `Emit new event when a repository is forked [See the documentation](${DOCS_LINK})`,
  version: "1.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSampleTimerEvent,
    getSampleWebhookEvent,
    getWebhookEvents() {
      return [
        "fork",
      ];
    },
    shouldEmitWebhookEvent(body) {
      return !!body?.forkee;
    },
    getWebhookEventItem(body) {
      return body.forkee;
    },
    getSummary(item) {
      return `New fork: "${item.name}"`;
    },
    getPollingData(args) {
      return this.github.getRepositoryForks(args);
    },
  },
};
