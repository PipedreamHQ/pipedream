import common from "../common/common.mjs";

export default {
  ...common,
  key: "clickup-updated-task",
  name: "New Updated Task (Instant)",
  description: "Emit new event when a new task is updated",
  version: "0.0.2",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    _getMeta(historyItems) {
      return {
        id: historyItems[0].id,
        summary: String(historyItems[0].id),
        ts: Date.now(),
      };
    },
    _getEventsList() {
      return [
        "taskUpdated",
      ];
    },
  },
  async run(httpRequest) {
    console.log("Event received");
    this.checkSignature(httpRequest);
    this.$emit(httpRequest.body, this._getMeta(httpRequest.body.history_items));
  },
};
