import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "thinkific-lesson-completed-instant",
  name: "Lesson Completed (Instant)",
  description: "Emit new event when a user completes a lesson in a course.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return "lesson.completed";
    },
    getSummary(event) {
      return `Lesson Completed: ${event.payload.lesson.name}`;
    },
  },
  sampleEmit,
};
