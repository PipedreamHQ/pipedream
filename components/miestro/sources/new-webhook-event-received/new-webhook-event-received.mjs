import app from "../../miestro.app.mjs";
import eventTypes from "../../common/event-types.mjs";

export default {
  key: "miestro-new-webhook-event-received",
  name: "New Webhook Event Received",
  description: "Emit new event when a new webhook event is received. Needs webhook registration in Miestro UI using the http endpoint of this source. [See the documentation](https://support.miestro.com/article/277-how-to-create-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    http: "$.interface.http",
    types: {
      type: "string[]",
      label: "Event Types",
      description: "If selected, only events with this event types will be filtered.",
      options: eventTypes,
      optional: true,
    },
  },
  async run(event) {
    const { body } = event;
    if (!this.types || this.types.length == 0 || this.types.includes(body.type)) {
      this.$emit(body, {
        id: Date.now(),
        summary: `New webhook event received - ${eventTypes.find(( type ) => type.value == body.type)?.label}`,
        ts: Date.now(),
      });
    }
  },
};
