import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "refiner-new-survey-completion",
  name: "New Survey Completion",
  description: "Emit new event whenever a user completes a survey in Refiner. [See the documentation](https://refiner.io/docs/api/#get-responses)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.refiner.listResponses;
    },
    getParams() {
      return {
        include: "completed",
      };
    },
    getSummary(item) {
      return `Survey (${item.form.uuid}) completed by user ${item.contact.uuid}`;
    },
    getItemDate(item) {
      return item.completed_at;
    },
  },
  sampleEmit,
};
