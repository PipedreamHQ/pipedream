import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "buildchatbot-new-question-and-answer",
  name: "New Question and Answer Created",
  description: "Emit new event when a new question and answer based on tenant is created. [See the documentation](https://documenter.getpostman.com/view/27680478/2s9YR6baAb#77ffafb3-2474-4a73-9592-28320bce20f5)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFieldId() {
      return "id";
    },
    getFunction() {
      return this.buildchatbot.listQuestionAndAnswers;
    },
    getSummary(item) {
      return `New Question and Answer: ${item.qa_id}`;
    },
  },
  sampleEmit,
};
