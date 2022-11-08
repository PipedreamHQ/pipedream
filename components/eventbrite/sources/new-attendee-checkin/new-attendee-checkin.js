const common = require("../common/webhook.js");

module.exports = {
  ...common,
  key: "eventbrite-new-attendee-checkin",
  name: "New Attendee Check-In (Instant)",
  description: "Emits an event when an attendee checks in to an event",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getActions() {
      return "attendee.checked_in";
    },
    async getData(attendee) {
      const { event_id: eventId } = attendee;
      const event = await this.eventbrite.getEvent(eventId);
      return {
        attendee,
        event,
      };
    },
    generateMeta({ attendee }) {
      const {
        id, profile, created,
      } = attendee;
      return {
        id,
        summary: profile.name,
        ts: Date.parse(created),
      };
    },
  },
};
