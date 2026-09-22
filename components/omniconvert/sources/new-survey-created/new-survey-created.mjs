import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "omniconvert-new-survey-created",
  name: "New Survey Created",
  description: "Emit new event when a new survey is created. [See the documentation](https://api.omniconvert.com/docs#get--v1-experiments)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getExperimentType() {
      return "survey";
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New survey created: ${item.name}`,
        ts: Date.now(),
      };
    },
  },
};
