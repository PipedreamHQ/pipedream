import common from "../common/polling.mjs";

export default {
  ...common,
  key: "botpress-new-bot-event-created",
  name: "New Bot Event Created",
  description: "Emit new event from bot is created. [See the documentation](https://botpress.com/docs/api-documentation/#list-events)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    type: {
      type: "string",
      label: "Event Type",
      description: "The type of event to poll for",
      options: [
        "state_expired",
        "message_created",
        "task_update",
        "schedulev1",
        "botpublished",
        "botready",
        "resumeprocessing",
        "hitlAgent",
        "webchat:conversationStarted",
        "webchat:trigger",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceName() {
      return "events";
    },
    getResourcesFn() {
      return this.app.listEvents;
    },
    getResourcesFnArgs() {
      return {
        params: {
          type: this.type,
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Event: ${resource.type}`,
        ts: Date.parse(resource.createdAt),
      };
    },
  },
};
