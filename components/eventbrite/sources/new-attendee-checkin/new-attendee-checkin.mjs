import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "eventbrite-new-attendee-checkin",
  name: "New Attendee Check-In (Instant)",
  description: "Emit new event when an attendee checks in to an event",
  version: "0.0.5",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getActions() {
      return "attendee.checked_in";
    },
    async getData(attendee) {
      const { event_id: eventId } = attendee;
      const event = await this.eventbrite.getEvent(null, eventId);
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
