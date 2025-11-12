import common from "../common.mjs";

export default {
  ...common,
  key: "close-new-opportunity",
  name: "New Opportunity",
  description: "Emit new event when a new Opportunity is created",
  version: "0.1.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        {
          object_type: "opportunity",
          action: "created",
        },
      ];
    },
  },
};
