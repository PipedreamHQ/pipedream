import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "plain-thread-created",
  name: "Thread Created",
  description: "Emit new event when a thread is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "thread.thread_created";
    },
    getSummary({ payload }) {
      return `Thread Created ID ${payload.thread.id}`;
    },
  },
  sampleEmit,
};
