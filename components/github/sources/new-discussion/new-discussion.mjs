import common from "../common/common-flex.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./common-sample-events.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks/webhook-events-and-payloads#discussion";

export default {
  ...common,
  key: "github-new-discussion",
  name: "New Discussion",
  description: `Emit new event when a discussion is created [See the documentation](${DOCS_LINK})`,
  version: "1.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSampleTimerEvent,
    getSampleWebhookEvent,
    getWebhookEvents() {
      return [
        "discussion",
      ];
    },
    shouldEmitWebhookEvent(body) {
      return body?.action === "created";
    },
    getWebhookEventItem(body) {
      return body.discussion;
    },
    getSummary(item) {
      return `New discussion: "${item.title}"`;
    },
    getPollingData(args) {
      return this.github.getDiscussions(args);
    },
    sortByTimestamp(items) {
      return items.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA - dateB;
      });
    },
  },
};
