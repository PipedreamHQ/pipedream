import todoist from "../../todoist.app.mjs";
import fs from "fs";
import converter from "json-2-csv";

export default {
  key: "todoist-import-tasks",
  name: "Import Tasks",
  description: "Import tasks into a selected project. [See Docs](https://developer.todoist.com/sync/v8/#add-an-item)",
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
    const tasks = await converter.csv2jsonAsync(fileContents);
    const data = tasks.map((task) => ({
      content: task.content,
      description: task.description,
      project_id: project,
      due: task.due,
      priority: task.priority,
      parent_id: task.parent_id,
      child_order: task.order,
      labels: task.label_ids,
    }));
    const resp = await this.todoist.createTasks({
      $,
      data,
    });
    $.export("$summary", `Successfully imported ${tasks.length} task${tasks.length === 1
      ? ""
      : "s"} from "${path}"`);
    return resp;
  },
};
