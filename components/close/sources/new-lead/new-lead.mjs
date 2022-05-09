import common from "../common.mjs";

export default {
  ...common,
  key: "close-new-lead",
  name: "New Lead",
  description: "Emit new event when a new Lead is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        {
          object_type: "lead",
          action: "created",
        },
      ];
    },
  },
};
