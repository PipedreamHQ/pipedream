import common from "../common/common-flex.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./common-sample-events.mjs";

export default {
  ...common,
  key: "github-new-commit-comment",
  name: "New Commit Comment",
  description: "Emit new event when a commit comment is created",
  version: "1.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSampleTimerEvent,
    getSampleWebhookEvent,
    getWebhookEvents() {
      return [
        "commit_comment",
      ];
    },
    shouldEmitWebhookEvent(body) {
      return body?.action === "created";
    },
    getWebhookEventItem(body) {
      return body.comment;
    },
    getSummary(item) {
      return `New comment (${item.id})`;
    },
    getPollingData(args) {
      return this.github.getRepositoryLatestCommitComments(args);
    },
    getHttpDocsLink() {
      return "https://docs.github.com/en/webhooks/webhook-events-and-payloads#commit_comment";
    },
    getTimerDocsLink() {
      return "https://docs.github.com/en/rest/commits/comments?apiVersion=2022-11-28#list-commit-comments-for-a-repository";
    },
  },
};
