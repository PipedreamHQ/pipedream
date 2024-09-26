import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "resource_guru-new-project-event-instant",
  name: "New Project Event (Instant)",
  description: "Emit new event when a project is created, updated or deleted.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return [
        "projects",
      ];
    },
    getSummary(body) {
      return `New project ${body.payload.action}d`;
    },
  },
  sampleEmit,
};
