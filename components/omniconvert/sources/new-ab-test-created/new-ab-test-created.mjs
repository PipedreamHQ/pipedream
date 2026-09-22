import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "omniconvert-new-ab-test-created",
  name: "New AB Test Created",
  description: "Emit new event when a new AB test is created. [See the documentation](https://api.omniconvert.com/docs#get--v1-experiments)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getExperimentType() {
      return "ab";
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New AB test created: ${item.name}`,
        ts: Date.now(),
      };
    },
  },
};
