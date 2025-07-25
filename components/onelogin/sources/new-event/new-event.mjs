import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "onelogin-new-event",
  name: "New Event",
  description: "Emit new event when a selected event occurs in OneLogin. [See the documentation](https://developers.onelogin.com/api-docs/1/events/get-events)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventType: {
      propDefinition: [
        common.props.onelogin,
        "eventType",
      ],
      withLabel: true,
    },
  },
  methods: {
    ...common.methods,
    getEventType() {
      return this.eventType.value;
    },
    getSummary() {
      return `New event: ${this.eventType.label}`;
    },
  },
  sampleEmit,
};
