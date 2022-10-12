import common from "../common/common.mjs";

export default {
  ...common,
  key: "clickup-new-task",
  name: "New Task (Instant)",
  description: "Emit new event when a new task is created",
  version: "0.0.3",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    _getMeta({ task_id: taskId }) {
      return {
        id: taskId,
        summary: String(taskId),
        ts: Date.now(),
      };
    },
    _getEventsList() {
      return [
        "taskCreated",
      ];
    },
  },
  async run(httpRequest) {
    console.log("Event received");
    this.checkSignature(httpRequest);
    this.$emit(httpRequest.body, this._getMeta(httpRequest.body));
  },
};
