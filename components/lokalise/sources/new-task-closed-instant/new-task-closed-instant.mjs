import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "lokalise-new-task-closed-instant",
  name: "New Task Closed (Instant)",
  description: "Emit new event when a task is closed in Lokalise",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "project.task.closed",
      ];
    },
    getSummary({ task }) {
      return `Task Closed with ID: ${task.id}`;
    },
  },
  sampleEmit,
};
