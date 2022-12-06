import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Attendee Registered",
  version: "0.0.2",
  key: "heysummit-new-attendee-registered",
  description: "Emit new event when an attendee is registered on a event.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    emitEvent(data) {
      if (this.eventId && +data.event_id !== +this.eventId) {
        return;
      }

      this.$emit(data, {
        id: data.id,
        summary: `New attendee registered with id ${data.id}`,
        ts: new Date(),
      });
    },
    getResources(args = {}) {
      return this.heysummit.getAttendees(args);
    },
  },
};
