import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "hana-new-space-added",
  name: "New Space Added",
  description: "Emit new event when a new space is added. [See the documentation](https://docs.hanabot.ai/docs/tutorial-connectors/hana-api#get-spaces-hana-is-integrated-in)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResults() {
      return this.hana.getPaginatedResults({
        fn: this.hana.searchSpaces,
      });
    },
    generateMeta(space) {
      return {
        id: space._id,
        summary: `New space: ${space.displayName}`,
        ts: Date.parse(space.createdAt),
      };
    },
  },
};
