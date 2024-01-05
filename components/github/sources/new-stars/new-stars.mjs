import common from "../common/common-flex.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./sample-events.mjs";

const DOCS_LINK = "https://docs.github.com/en/webhooks/webhook-events-and-payloads#star";

export default {
  ...common,
  key: "github-new-stars",
  name: "New stars",
  description: `Emit new event when a repository is starred [See the documentation](${DOCS_LINK})`,
  version: "1.0.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSampleTimerEvent,
    getSampleWebhookEvent,
    getWebhookEvents() {
      return [
        "star",
      ];
    },
    shouldEmitWebhookEvent(body) {
      return body?.action === "created";
    },
    getId(body) {
      return body.sender.id;
    },
    getSummary(body) {
      return `New star by: ${body.sender.login}`;
    },
    getPollingData(args) {
      return this.github.getRepositoryLatestCollaborators({
        ...args,
        per_page: 100,
      });
    },
  },
};
