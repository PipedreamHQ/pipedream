import common from "../common/base.mjs";

export default {
  ...common,
  key: "pipedrive-new-event-instant",
  name: "New Event (Instant)",
  description: "Emit new event when a new webhook event is received. [See the documentation](https://developers.pipedrive.com/docs/api/v1/Webhooks#addWebhook)",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventAction: {
      type: "string",
      label: "Event Action",
      description: "The type of action to receive notifications about. Wildcard (*) will match all supported actions.",
      options: [
        "*",
        "create",
        "change",
        "delete",
      ],
    },
    eventObject: {
      type: "string",
      label: "Event Object",
      description: "The type of object to receive notifications about. Wildcard (*) will match all supported objects.",
      options: [
        "*",
        "activity",
        "deal",
        "lead",
        "note",
        "organization",
        "person",
        "pipeline",
        "product",
        "stage",
        "user",
      ],
    },
  },
  methods: {
    ...common.methods,
    getExtraData() {
      return {
        event_action: this.eventAction,
        event_object: this.eventObject,
      };
    },
    getSummary(body) {
      return `New ${body.meta.action}.${body.meta.entity} event`;
    },
  },
};
