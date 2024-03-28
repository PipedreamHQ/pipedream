import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "teamioo-new-contact-added",
  name: "New Contact Added",
  description: "Emit new event when a new contact (client) is added.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunc() {
      return this.teamioo.listClients;
    },
    getSummary(item) {
      return `New client created with Id: ${item._id}`;
    },
  },
  sampleEmit,
};
