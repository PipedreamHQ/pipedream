const common = require("../common-webhook.js");

module.exports = {
  ...common,
  key: "eventbrite-new-attendee-registered",
  name: "New Attendee Registered (Instant)",
  description: "Emits an event when an attendee registers for an event",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getActions() {
      return "order.placed";
    },
    async getData(order) {
      const { id: orderId, event_id: eventId } = order;
      const attendees = await this.paginate(
        this.eventbrite.getOrderAttendees.bind(this),
        "attendees",
        orderId
      );
      const event = await this.eventbrite.getEvent(eventId, {
        expand: "ticket_classes",
      });
      return {
        order,
        attendees,
        event,
      };
    },
    generateMeta({ order }) {
      const { id, name: summary, created } = order;
      return {
        id,
        summary,
        ts: Date.parse(created),
      };
    },
  },
};