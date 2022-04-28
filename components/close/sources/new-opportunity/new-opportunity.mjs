import common from "../common.mjs";

export default {
  ...common,
  key: "close-new-opportunity",
  name: "New Opportunity",
  description: "Emit new event when a new Opportunity is created",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    ...common.hooks,
    async activate() {
      await this.activate({
        events: [
          {
            object_type: "opportunity",
            action: "created",
          },
        ],
      });
    },
  },
};
