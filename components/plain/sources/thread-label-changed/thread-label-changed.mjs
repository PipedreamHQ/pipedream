import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "plain-thread-label-changed",
  name: "Thread Label Changed",
  description: "Emit new event when a thread label is changed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "thread.thread_labels_changed";
    },
    getSummary({ payload }) {
      return `Thread Label Changed ID ${payload.thread.id}`;
    },
  },
  sampleEmit,
};
