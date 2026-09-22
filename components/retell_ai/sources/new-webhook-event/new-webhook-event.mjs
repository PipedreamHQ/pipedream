import retell from "../../retell_ai.app.mjs";
import eventTypes from "../common/event-types.mjs";

export default {
  key: "retell_ai-new-webhook-event",
  name: "New Webhook Event (Instant)",
  description: "Emit new event when a new webhook event is received for a specific agent. [See the documentation](https://docs.retellai.com/features/webhook-overview)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    retell,
    http: "$.interface.http",
    agentId: {
      propDefinition: [
        retell,
        "agentId",
      ],
    },
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "The events to subscribe to",
      options: eventTypes,
    },
  },
  hooks: {
    async activate() {
      await this.retell.updateAgent({
        agentId: this.agentId,
        data: {
          webhook_url: this.http.endpoint,
          webhook_events: this.eventTypes,
        },
      });
    },
    async deactivate() {
      await this.retell.updateAgent({
        agentId: this.agentId,
        data: {
          webhook_url: null,
          webhook_events: [],
        },
      });
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }
    this.$emit(body, {
      id: Date.now(),
      summary: `New ${body.event} event`,
      ts: Date.now(),
    });
  },
};
