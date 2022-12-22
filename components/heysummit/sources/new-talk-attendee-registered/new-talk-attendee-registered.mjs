import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Talk Attendee Registered",
  version: "0.0.3",
  key: "heysummit-new-talk-attendee-registered",
  description: "Emit new event when an attendee is registered on a talk.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      if ((this.eventId && +data.event_id !== +this.eventId) || !data.talks.length) {
        return;
      }

      this.$emit(data, {
        id: data.id,
        summary: `New attendee registered on a talk with id ${data.id}`,
        ts: new Date(),
      });
    },
    getResources(args = {}) {
      return this.heysummit.getAttendees(args);
    },
  },
};
