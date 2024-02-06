import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nifty-new-message-posted",
  name: "New Message Posted",
  description: "Emit new event when a new message is posted in a team's discussion.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return [
        "messageCreated",
      ];
    },
    getSummary({ data }) {
      return `New message posted in project with ID: ${data.id}`;
    },
  },
  sampleEmit,
};
