import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "robly-new-contact",
  name: "New Contact",
  description: "Emit new event when a new contact is created. [See the documentation](https://docs.robly.com/docs/api-v1/9d6711cb3dc75-get-contacts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(item) {
      return `New contact created: ${item.email}`;
    },
  },
  sampleEmit,
};

