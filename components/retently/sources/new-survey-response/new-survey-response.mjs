import common from "../common/common.mjs";

export default {
  ...common,
  key: "retently-new-survey-response",
  name: "New Survey Response",
  description: "Emit new event when a new survey response is received.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.retently.listFeedback;
    },
    getResultField() {
      return "responses";
    },
    generateMeta(response) {
      return {
        id: response.id,
        summary: `${response.email} - ${response.campaignName}`,
        ts: Date.parse(response.createdDate),
      };
    },
  },
};
