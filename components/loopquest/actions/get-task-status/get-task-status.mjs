import app from "../../loopquest.app.mjs";

export default {
  key: "loopquest-get-task-status",
  name: "Get Task Status",
  description: "Check a LoopQuest task's status / verdict. [See the docs](https://loopquest.tomphillips.uk/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    loopquest: app,
    taskId: { propDefinition: [app, "taskId"] },
  },
  async run({ $ }) {
    const res = await this.loopquest.getTask({ $, taskId: this.taskId });
    $.export("$summary", `Task ${this.taskId} is ${res.status}`);
    return res;
  },
};
