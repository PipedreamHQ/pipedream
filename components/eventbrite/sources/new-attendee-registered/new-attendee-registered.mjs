import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "eventbrite-new-attendee-registered",
  name: "New Attendee Registered (Instant)",
  description: "Emit new event when an attendee registers for an event",
  version: "0.0.5",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getActions() {
      return "order.placed";
    },
    async getData(order) {
      const {
        id: orderId, event_id: eventId,
      } = order;
      const attendeeStream = await this.resourceStream(
        this.eventbrite.getOrderAttendees.bind(this),
        "attendees",
        orderId,
      );
      const attendees = [];
      for await (const attendee of attendeeStream) {
        attendees.push(attendee);
      }
      const event = await this.eventbrite.getEvent(null, eventId, {
        expand: "ticket_classes",
      });
      return {
        order,
        attendees,
        event,
      };
    },
    generateMeta({ order }) {
      const {
        id, name: summary, created,
      } = order;
      return {
        id,
        summary,
        ts: Date.parse(created),
      };
    },
  },
};
