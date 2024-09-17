import sendbird from "../../sendbird_ai_chabot.app.mjs";
import events from "../common/events.mjs";

export default {
  key: "sendbird_ai_chabot-new-event-received",
  name: "New Event Received (Instant)",
  description: "Emit new event when a new webhook event is received.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    sendbird,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    events: {
      type: "string[]",
      label: "Events",
      description: "The events to subscribe to",
      options: events,
    },
  },
  hooks: {
    async activate() {
      await this.sendbird.updateWebhook({
        data: {
          enabled: true,
          url: this.http.endpoint,
          enabled_events: this.events,
        },
      });
    },
    async deactivate() {
      await this.sendbird.updateWebhook({
        data: {
          enabled: false,
          url: this.http.endpoint,
          enabled_events: [],
        },
      });
    },
  },
  methods: {
    generateMeta(body) {
      const ts = Date.now();
      return {
        id: ts,
        summary: `New ${body.category} event`,
        ts,
      };
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }
    this.http.respond({
      status: 200,
    });
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
