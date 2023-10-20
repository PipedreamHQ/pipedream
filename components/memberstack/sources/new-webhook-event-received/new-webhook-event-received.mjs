import memberstack from "../../memberstack.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "memberstack-new-webhook-event-received",
  name: "New Webhook Event Received (Instant)",
  description: "Emit new event when a new webhook event is received. Must create webhook in Memberstack UI using the http endpoint of this source. [See the docs](https://docs.memberstack.com/hc/en-us/articles/7329156946587-Webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    memberstack,
    http: "$.interface.http",
    db: "$.service.db",
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "Filter incoming events by event type",
      options: constants.EVENT_TYPE_OPTIONS,
      optional: true,
    },
  },
  methods: {
    generateMeta(body) {
      return {
        id: Date.now(),
        summary: body.event,
        ts: Date.now(),
      };
    },
  },
  async run(event) {
    const { body } = event;

    if (!body.event) {
      return;
    }

    if (!this.eventTypes || this.eventTypes.includes(body.event)) {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    }
  },
};
