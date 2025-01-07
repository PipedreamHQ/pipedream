import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "ironclad-new-workflow-event-instant",
  name: "New Workflow Event (Instant)",
  description: "Emit new event when a new workflow event is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    events: {
      propDefinition: [
        common.props.ironclad,
        "selectedEvents",
      ],
    },
  },
  methods: {
    ...common.methods,
    getEvents() {
      return this.events;
    },
  },
  sampleEmit,
};
