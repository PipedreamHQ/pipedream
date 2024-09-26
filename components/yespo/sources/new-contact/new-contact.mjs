import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "yespo-new-contact",
  name: "New Contact Added to Yespo",
  description: "Emit new event when a new contact is added to Yespo.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFn() {
      return this.yespo.listContacts;
    },
  },
  sampleEmit,
};
