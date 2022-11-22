import common from "../common.mjs";

export default {
  ...common,
  key: "temi-new-transcript",
  name: "New Transcript",
  description: "Emit new event when a new transcript is created.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getStatus() {
      return "transcribed";
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_on),
        summary: `New Transcript ${resource.id}`,
      };
    },
  },
};
