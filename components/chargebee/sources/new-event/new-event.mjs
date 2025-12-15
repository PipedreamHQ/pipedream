import constants from "../../common/constants.mjs";
import events from "../common/events.mjs";
import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "chargebee-new-event",
  name: "New Event (Instant)",
  description: "Emit new event when the selected event is triggered. [See the Documentation](https://apidocs.chargebee.com/docs/api/events). Please make sure once you deploy this source, you copy/paste the webhook URL to create it in your [Chargebee Webhook settings](https://www.chargebee.com/docs/2.0/webhook_settings.html#configure-webhooks).",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    ...common.props,
    info: {
      type: "alert",
      alertType: "info",
      content: "Emit new event when the selected event is triggered. [See the Documentation](https://apidocs.chargebee.com/docs/api/events). Please make sure once you deploy this source, you copy/paste the webhook URL to create it in your [Chargebee Webhook settings](https://www.chargebee.com/docs/2.0/webhook_settings.html#configure-webhooks).",
    },
    eventType: {
      type: "string[]",
      label: "Event Type",
      description: "Select the type of the event you want to receive.",
      options: Object.keys(events).map((key) => events[key]),
    },
  },
  hooks: {},
  methods: {
    ...common.methods,
    getEventTypes() {
      return this.eventType;
    },
    async getResources() {
      const { list } = await this.app.getEvents({
        "limit": constants.MAX_LIMIT,
        "sort_by[desc]": "occurred_at",
      });
      return list;
    },
    processEvent(event) {
      this.$emit(event, this.generateMeta(event));
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `New Event Triggered: ${event.id}`,
        ts: event.occurred_at,
      };
    },
  },
};
