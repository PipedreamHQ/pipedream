import common from "../common/common-sources.mjs";

export default {
  ...common,
  type: "source",
  key: "teamwork-task-updated",
  name: "New Task Updated",
  description: "Emit new event when a new task is updated",
  version: "0.0.1",
  methods: {
    ...common.methods,
    _getEventName() {
      return "TASK.UPDATED";
    },
  },
  async run(event) {
    this._checkHmac(event.bodyRaw, event.headers["x-projects-signature"]);
    this.$emit(event.body, {
      id: event.body["Task.ID"],
      summary: event.body["Task.Name"],
      ts: event.body["Task.DateCreated"],
    });
  },
};
