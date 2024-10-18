import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "teach_n_go-new-class",
  name: "New Class Created",
  description: "Emit new event when a class is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.app.listCourses;
    },
    getSummary(item) {
      return `New Class: ${item.course_full_title}`;
    },
  },
  sampleEmit,
};
