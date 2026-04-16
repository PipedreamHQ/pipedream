import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "evenium-new-participant",
  name: "New Participant",
  description: "Emit new event when a new participant (guest) is added to an event. [See the documentation](https://static.evenium.com/api-docs/organizer/index-json.html#_get_all_guests)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventId: {
      propDefinition: [
        common.props.evenium,
        "eventId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getArgs() {
      return {
        eventId: this.eventId,
      };
    },
    getFields() {
      return {
        data: "guests",
        filter: "since",
        date: "lastUpdate",
        id: "guestId",
      };
    },
    getSummary(result) {
      return `New Participant: ${result.firstName} ${result.lastName}`;
    },
    getFunction() {
      return this.evenium.listGuests;
    },
  },
  sampleEmit,
};
