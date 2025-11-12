import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "aircall-new-number-created",
  name: "New Number Created",
  description: "Emit new event when a number is created",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      // You may implement this if you want historical events for new numbers.
      // It depends on whether Aircall provides historical data for number creations.
      // If not, you can return an empty array or omit this method.
      return [];
    },
    getEventType() {
      return "number.created";
    },
    generateMeta(data) {
      return {
        id: `${data.id}`,
        summary: `New number created: ${data.name} (${data.digits})`,
        ts: data.created_at, // Convert created_at timestamp to a Date object
        additionalData: {
          direct_link: data.direct_link,
          country: data.country,
          time_zone: data.time_zone,
          open: data.open,
          availability_status: data.availability_status,
          is_ivr: data.is_ivr,
          live_recording_activated: data.live_recording_activated,
          users: data.users,
          priority: data.priority,
          messages: data.messages,
        },
      };
    },
  },
};
