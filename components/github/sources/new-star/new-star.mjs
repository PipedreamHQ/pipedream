import common from "../common/common-flex.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./common-sample-events.mjs";

const DOCS_LINK = "https://docs.github.com/en/webhooks/webhook-events-and-payloads#star";

export default {
  ...common,
  key: "github-new-star",
  name: "New Stars",
  description: `Emit new event when a repository is starred [See the documentation](${DOCS_LINK})`,
  version: "1.0.4",
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
    getId({
      id, sender,
    }) {
      return sender?.id ?? id;
    },
    getSummary({
      login, sender,
    }) {
      return `New star by: ${sender?.login ?? login}`;
    },
    getPollingData(args) {
      return this.github.getRepositoryStargazers({
        ...args,
        per_page: 100,
      });
    },
  },
};
