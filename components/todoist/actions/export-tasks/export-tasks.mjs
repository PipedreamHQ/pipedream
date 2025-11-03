import todoist from "../../todoist.app.mjs";
import fs from "fs";
import { file } from "tmp-promise";
import converter from "json-2-csv";

export default {
  key: "todoist-export-tasks",
  name: "Export Tasks",
  description: "Export project task names as comma separated file. Returns path to new file. [See Docs](https://developer.todoist.com/rest/v2/#get-active-tasks)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    todoist,
    project: {
      propDefinition: [
        todoist,
        "project",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
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
    const csv = converter.json2csv(tasks);

    const { path } = await file({
      postfix: ".csv",
    });
    await fs.promises.appendFile(path, Buffer.from(csv));

    $.export("$summary", `Successfully exported ${tasks.length} task${tasks.length === 1
      ? ""
      : "s"} to "${path}"`);
    return path;
  },
};
