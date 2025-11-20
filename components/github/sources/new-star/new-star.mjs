import common from "../common/common-flex.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./common-sample-events.mjs";

export default {
  ...common,
  key: "github-new-star",
  name: "New Stars",
  description: "Emit new event when a repository is starred",
  version: "1.0.12",
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
    getHttpDocsLink() {
      return "https://docs.github.com/en/webhooks/webhook-events-and-payloads#star";
    },
    getTimerDocsLink() {
      return "https://docs.github.com/en/rest/activity/starring?apiVersion=2022-11-28#list-stargazers";
    },
  },
};
