import common from "../common/base.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "woovi-new-webhook-event",
  name: "New Webhook Event (Instant)",
  description: "Emit new event when a webhook is called. [See the documentation](https://developers.woovi.com/en/api#tag/webhook/paths/~1api~1v1~1webhook/post)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    event: {
      type: "string",
      label: "Event",
      description: "Register a webhook to listent for the selected event",
      options: events,
    },
  },
  methods: {
    ...common.methods,
    getEvent() {
      return this.event;
    },
    generateMeta() {
      const ts = Date.now();
      return {
        id: ts,
        summary: "New Event Received",
        ts,
      };
    },
  },
};
