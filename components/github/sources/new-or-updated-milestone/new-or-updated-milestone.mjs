import common from "../common/common-flex-new-or-updated.mjs";
import constants from "../common/constants.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./common-sample-events.mjs";

const DOCS_LINK =
  "https://docs.github.com/en/webhooks-and-events/webhooks/webhook-events-and-payloads#milestone";

export default {
  ...common,
  key: "github-new-or-updated-milestone",
  name: "New or Updated Milestone",
  description: `Emit new events when a milestone is created or updated [See the documentation](${DOCS_LINK})`,
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
          options: constants.EVENT_TYPES_MILESTONES,
        },
      };
    },
    getSampleTimerEvent,
    getSampleWebhookEvent,
    getWebhookEvents() {
      return [
        "milestone",
      ];
    },
    getBodyItem(body) {
      return body.milestone;
    },
    getSummary(action, item) {
      return `Milestone ${action}: "${item.title}"`;
    },
    getPollingData({ repoFullname }) {
      return this.github.getRepositoryMilestones({
        repoFullname,
      });
    },
  },
};
