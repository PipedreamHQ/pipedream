import base from "../common/base.mjs";

export default {
  ...base,
  key: "gorgias-new-events",
  name: "New Events",
  description: "Emit new Gorgias event",
  version: "0.1.0",
  type: "source",
  methods: {
    ...base.methods,
    getEventTypes() {
      return {};
    },
  },
};
