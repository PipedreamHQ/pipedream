import common from "../common/common-flex.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./common-sample-events.mjs";

export default {
  ...common,
  key: "github-new-issue-comment",
  name: "New Issue Comment",
  description: "Emit new event when a new comment is added to an issue or pull request",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSampleWebhookEvent,
    getSampleTimerEvent,
    getWebhookEvents() {
      return [
        "issue_comment",
      ];
    },
    shouldEmitWebhookEvent(body) {
      return body?.action === "created";
    },
    getWebhookEventItem(body) {
      return body.comment;
    },
    getSummary(item) {
      return `New comment: ${this.getId(item)}`;
    },
    async getPollingData({ repoFullname }) {
      const { data } = await this.github._client().request(`GET /repos/${repoFullname}/issues/comments`, {
        sort: "created",
        direction: "desc",
      });
      return data;
    },
    getHttpDocsLink() {
      return "https://docs.github.com/en/webhooks/webhook-events-and-payloads#issue_comment";
    },
    getTimerDocsLink() {
      return "https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28#list-issue-comments-for-a-repository";
    },
  },
};
