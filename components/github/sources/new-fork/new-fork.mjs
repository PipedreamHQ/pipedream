import common from "../common/common-flex.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./common-sample-events.mjs";

export default {
  ...common,
  key: "github-new-fork",
  name: "New Fork",
  description: "Emit new event when a repository is forked",
  version: "1.0.12",
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
    getHttpDocsLink() {
      return "https://docs.github.com/en/webhooks/webhook-events-and-payloads#fork";
    },
    getTimerDocsLink() {
      return "https://docs.github.com/en/rest/repos/forks?apiVersion=2022-11-28#list-forks";
    },
  },
};
