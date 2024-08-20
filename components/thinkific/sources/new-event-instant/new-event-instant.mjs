import constants from "../../common/constants.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "thinkific-new-event-instant",
  name: "New Event (Instant)",
  description: "Emit new event when the selected topic is triggered.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    topic: {
      type: "string",
      label: "Topic",
      description: "The topic used to trigger the events.",
      options: constants.TOPIC_OPTIONS,
    },
  },
  methods: {
    ...common.methods,
    getTopic() {
      return this.topic;
    },
    getSummary(event) {
      return `New Event: ${event.payload.id}`;
    },
  },
  sampleEmit,
};
