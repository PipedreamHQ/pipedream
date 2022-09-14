import app from "../../teamwork.app.mjs";

export default {
  type: "action",
  key: "teamwork-create-task",
  version: "0.0.6",
  name: "Create Task",
  description: "Create a new task",
  props: {
    app,
    tasklistId: {
      propDefinition: [
        app,
        "tasklistId",
      ],
    },
  },
  async run () {
    console.log(await this.app.listTasklists());
  },
};
