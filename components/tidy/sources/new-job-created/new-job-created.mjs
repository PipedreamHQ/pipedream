import common from "../common/common.mjs";

export default {
  key: "tidy-new-address-created",
  name: "New Address Created",
  description: "Emit new event when a new address is created in Tidy",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  ...common,
  methods: {
    ...common.methods,
  },
};
