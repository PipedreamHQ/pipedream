import todoist from "../../todoist.app.mjs";
import fs from "fs";

export default {
  key: "todoist-import-tasks",
  name: "Import Tasks",
  description: "Import tasks into a selected project [See Docs](https://developer.todoist.com/rest/v1/#create-a-new-task)",
  version: "0.0.1",
  type: "action",
  props: {
    todoist,
    path: {
      propDefinition: [
        todoist,
        "path",
      ],
    },
    project: {
      propDefinition: [
        todoist,
        "project",
      ],
      description: "Project to import tasks into",
    },
  },
  async run ({ $ }) {
    const {
      path,
      project,
    } = this;

    const fileContents = (await fs.promises.readFile(path)).toString();
    const taskNames = fileContents.split(",");
    const result = [];
    for (const content of taskNames) {
      const newTask = await this.todoist.createTask({
        $,
        data: {
          project_id: project,
          content,
        },
      });
      result.push(newTask);
    }

    $.export("$summary", "Tasks imported successfully");
    return result;
  },
};
