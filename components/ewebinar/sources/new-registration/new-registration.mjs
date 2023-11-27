import common from "../common/base.mjs";

export default {
  ...common,
  key: "ewebinar-new-registration",
  name: "New Registration",
  description: "Emit new event when a registrant submits a completed registration form.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(registrant) {
      return `New Registration: ${registrant.name}`;
    },
    filterArray(array) {
      return array.filter((item) => item.state === "Registered");
    },
  },
};
