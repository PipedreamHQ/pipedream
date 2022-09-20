import common from "../../common/common-sources.mjs";

export default {
  ...common,
  type: "source",
  key: "teamwork-task-deleted",
  name: "New Task Deleted",
  description: "Emit new event when a new task is deleted",
  version: "0.0.1",
  methods: {
    ...common.methods,
    _getEventName() {
      return "TASK.DELETED";
    },
  },
  async run(event) {
    this._checkHmac(event.bodyRaw, event.headers["x-projects-signature"]);
    this.$emit(event.body, {
      id: event.body.ID,
      summary: `${event.body.ID} deleted by ${event.body["EventCreator.FirstName"]} ${event.body["EventCreator.LastName"]}`,
      ts: Date.now(),
    });
  },
};
