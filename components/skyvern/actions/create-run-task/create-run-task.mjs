import skyvern from "../../skyvern.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "skyvern-create-run-task",
  name: "Create and Run Task",
  description: "Create a new task and run it instantly in Skyvern. Useful for one-off automations. [See the documentation](https://docs.skyvern.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    skyvern,
    taskName: {
      propDefinition: [
        skyvern,
        "taskName",
      ],
    },
    taskGoal: {
      propDefinition: [
        skyvern,
        "taskGoal",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.skyvern.createAndRunTask({
      taskName: this.taskName,
      taskGoal: this.taskGoal,
    });
    $.export("$summary", `Created and ran task with ID ${response.task_id}`);
    return response;
  },
};
