import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "eventzilla-new-attendee-added",
  name: "New Attendee Added",
  description: "Emit new event when a new attendee is added to an event in Eventzilla. [See the documentation](https://developer.eventzilla.net/docs/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventId: {
      propDefinition: [
        common.props.eventzilla,
        "eventId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.eventzilla.listAttendees;
    },
    getArgs() {
      return {
        eventId: this.eventId,
      };
    },
    getResourceKey() {
      return "attendees";
    },
    getSummary(item) {
      return `New Attendee ID: ${item.id}`;
    },
  },
  sampleEmit,
};
