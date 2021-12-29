import todoist from "../../todoist.app.mjs";
import fs from "fs";
import { file } from "tmp-promise";

export default {
  key: "todoist-export-tasks",
  name: "Export Tasks",
  description: "Export project task names as comma separated file. Returns path to new file [See Docs](https://developer.todoist.com/rest/v1/#get-active-tasks)",
  version: "0.0.1",
  type: "action",
  props: {
    todoist,
    project: {
      propDefinition: [
        todoist,
        "project",
      ],
    },
  },
  async run ({ $ }) {
    const { project } = this;

    const tasks = await this.todoist.getActiveTasks({
      $,
      params: {
        project_id: project,
      },
    });
    const names = [];
    for (const task of tasks) {
      names.push(task.content);
    }
    const { path } = await file();
    await fs.promises.appendFile(path, Buffer.from(names.toString()));

    $.export("$summary", "Tasks exported successfully");
    return path;
  },
};
