import common from "../common/common.mjs";
import eventsTypes from "../common/eventTypes.mjs";

export default {
  key: "jira-events",
  name: "New Event",
  description: "Emit new event when an event with subscribed event source triggered, [See the docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-webhooks/#api-rest-api-3-webhook-post)",
  version: "0.0.13",
  type: "source",
  dedupe: "unique",
  ...common,
  props: {
    ...common.props,
    events: {
      type: "string[]",
      label: "Event types",
      description: "he Jira events that trigger the webhook.",
      options: eventsTypes,
    },
  },
  methods: {
    ...common.methods,
    getEvents() {
      return this.events;
    },
  },
};
