import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "plain-thread-priority-changed",
  name: "Thread Priority Changed",
  description: "Emit new event when a thread's priority is changed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "thread.thread_priority_changed";
    },
    getSummary({ payload }) {
      return `Thread Priority Changed ID ${payload.thread.id}`;
    },
  },
  sampleEmit,
};
