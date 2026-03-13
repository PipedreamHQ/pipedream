import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "humanitix-new-ticket-created",
  name: "New Ticket Created",
  description: "Emit new event when a new ticket is created in Humanitix. [See the documentation](https://humanitix.stoplight.io/docs/humanitix-public-api/e508a657c1467-humanitix-public-api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventId: {
      propDefinition: [
        common.props.humanitix,
        "eventId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getData() {
      return {
        eventId: this.eventId,
      };
    },
    getFunction() {
      return this.humanitix.getTickets;
    },
    getSummary(item) {
      return `New Ticket: ${item._id}`;
    },
    getDataField() {
      return "tickets";
    },
  },
  sampleEmit,
};
