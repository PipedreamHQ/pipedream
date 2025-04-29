import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "lokalise-new-task-created-instant",
  name: "New Task Created (Instant)",
  description: "Emit new event when a new task is created in Lokalise",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "project.task.created",
      ];
    },
    getSummary({ task }) {
      return `New Task with ID: ${task.id}`;
    },
  },
  sampleEmit,
};
