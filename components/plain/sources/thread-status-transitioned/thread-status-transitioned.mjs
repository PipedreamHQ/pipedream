import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "plain-thread-status-transitioned",
  name: "Thread Status Changed",
  description: "Emit new event when a thread's status is transitioned.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "thread.thread_status_transitioned";
    },
    getSummary({ payload }) {
      return `Thread Status Transitioned ID ${payload.thread.id}`;
    },
  },
  sampleEmit,
};
