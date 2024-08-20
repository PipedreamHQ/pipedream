import common from "../common/common-flex-new-or-updated.mjs";
import constants from "../common/constants.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./common-sample-events.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks-and-events/webhooks/webhook-events-and-payloads#issues";

export default {
  ...common,
  key: "github-new-or-updated-issue",
  name: "New or Updated Issue",
  description: `Emit new events when an issue is created or updated [See the documentation](${DOCS_LINK})`,
  version: "1.1.1",
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
          options: constants.EVENT_TYPES_ISSUES,
        },
      };
    },
    getSampleTimerEvent,
    getSampleWebhookEvent,
    getWebhookEvents() {
      return [
        "issues",
      ];
    },
    getBodyItem(body) {
      return body.issue;
    },
    getSummary(action, item) {
      return `Issue ${action}: "${item.title}"`;
    },
    getPollingData({
      repoFullname, sort,
    }) {
      return this.github.getRepositoryLatestIssues({
        repoFullname,
        sort,
      });
    },
  },
};
