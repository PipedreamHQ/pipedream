import common from "../common/common-flex-new-or-updated.mjs";
import constants from "../common/constants.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./common-sample-events.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks-and-events/webhooks/webhook-events-and-payloads#pull_request";

export default {
  ...common,
  key: "github-new-or-updated-pull-request",
  name: "New or Updated Pull Request",
  description: `Emit new events when a pull request is opened or updated [See the documentation](${DOCS_LINK})`,
  version: "1.2.1",
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
          description: `Specify the type(s) of activity that should emit events. [See the documentation](${DOCS_LINK}) for more information on each type. By default, events will be emitted for all activity.`,
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
  },
};
