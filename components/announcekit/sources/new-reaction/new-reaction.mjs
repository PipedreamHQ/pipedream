import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "announcekit-new-reaction",
  name: "New Reaction",
  description: "Emit new event when a new reaction is created. [See the documentation](https://announcekit.app/docs/graphql-api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getSummary(reaction) {
      return `New Reaction with ID: ${reaction.id}`;
    },
    getVariables(variables) {
      return {
        ...variables,
        type: [
          "new-reaction",
        ],
      };
    },
  },
  sampleEmit,
};

