import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "alegra-new-item-instant",
  name: "New Item Added (Instant)",
  description: "Emit new event each time a new item is added.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "new-item";
    },
    getSummary({ item }) {
      return `New item added: ${item.name}`;
    },
  },
  sampleEmit,
};
