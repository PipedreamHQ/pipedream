import desktime from "../../desktime.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "desktime-create-project",
  name: "Create a New Project with Optional Tasks",
  description: "Create a new project with optional tasks in DeskTime. [See the documentation](https://desktime.com/app/settings/api?tab=project)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    desktime,
    name: {
      propDefinition: [
        desktime,
        "name",
      ],
    },
    tasks: {
      propDefinition: [
        desktime,
        "tasks",
      ],
    },
  },
  async run({ $ }) {
    const tasksParsed = this.tasks
      ? this.tasks.map((task) => JSON.parse(task))
      : [];
    const response = await this.desktime.createProject({
      name: this.name,
      tasks: tasksParsed,
    });

    $.export("$summary", `Successfully created project '${this.name}' with tasks: ${tasksParsed.map((task) => task.name).join(", ")}`);
    return response;
  },
};
