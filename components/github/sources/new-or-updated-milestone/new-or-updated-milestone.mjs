import common from "../common/common-flex-new-or-updated.mjs";
import constants from "../common/constants.mjs";
import {
  getSampleTimerEvent, getSampleWebhookEvent,
} from "./common-sample-events.mjs";

export default {
  ...common,
  key: "github-new-or-updated-milestone",
  name: "New or Updated Milestone",
  description: "Emit new event when a milestone is created or updated",
  version: "1.1.2",
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
    getHttpDocsLink() {
      return "https://docs.github.com/en/webhooks/webhook-events-and-payloads#milestone";
    },
    getTimerDocsLink() {
      return "https://docs.github.com/en/rest/issues/milestones?apiVersion=2022-11-28#list-milestones";
    },
  },
};
