import common from "../common/base.mjs";
import sampleEmit from "../new-contact-created/test-event.mjs";

export default {
  ...common,
  key: "botpenguin-new-incoming-message",
  name: "New Incoming Message",
  description: "Emit new event for each new incoming message from a user.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isContact() {
      return false;
    },
    getId(item) {
      return `${item._id}-${item.updatedAt}`;
    },
    getSummary(item) {
      return `New incoming message with Id: ${item._id}`;
    },
  },
  sampleEmit,
};
