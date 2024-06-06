import common from "../common/base.mjs";
import sampleEmit from "../new-contact-created/test-event.mjs";

export default {
  ...common,
  key: "botpenguin-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a user interacts with the bot and a new contact or lead is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isContact() {
      return true;
    },
    getId(item) {
      return item._id;
    },
    getSummary(item) {
      return `New contact with Id: ${item._id} was successfully created!`;
    },
  },
  sampleEmit,
};
