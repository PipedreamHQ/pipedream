import common from "../common/common-flex-new-or-updated.mjs";
import constants from "../common/constants.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./common-sample-events.mjs";

export default {
  ...common,
  key: "github-new-or-updated-pull-request",
  name: "New or Updated Pull Request",
  description: "Emit new event when a pull request is opened or updated",
  version: "1.2.9",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getHttpAdditionalProps() {
      return {
        eventTypes: {
          type: "string[]",
          label: "Filter Event Types",
          optional: true,
          description: "Specify the type(s) of activity that should emit events. By default, events will be emitted for all activity.",
          options: constants.EVENT_TYPES_PULL_REQUEST,
        },
      };
    },
    getSampleTimerEvent,
    getSampleWebhookEvent,
    getWebhookEvents() {
      return [
        "pull_request",
      ];
    },
    getBodyItem(body) {
      return body.pull_request;
    },
    getSummary(action, item) {
      return `PR ${action}: "${item.title}"`;
    },
    getPollingData({
      repoFullname, sort,
    }) {
      return this.github.getRepositoryLatestPullRequests({
        repoFullname,
        sort,
      });
    },
    getHttpDocsLink() {
      return "https://docs.github.com/en/webhooks/webhook-events-and-payloads#pull_request";
    },
    getTimerDocsLink() {
      return "https://docs.github.com/en/rest/pulls/pulls?apiVersion=2022-11-28";
    },
  },
};
