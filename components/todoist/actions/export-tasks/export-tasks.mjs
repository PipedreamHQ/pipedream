import todoist from "../../todoist.app.mjs";
import fs from "fs";
import { file } from "tmp-promise";
import converter from "json-2-csv";

export default {
  key: "todoist-export-tasks",
  name: "Export Tasks",
  description: "Export project task names as comma separated file. Returns path to new file. [See the documentation](https://developer.todoist.com/api/v1#tag/Tasks/operation/get_tasks_api_v1_tasks_get)",
  version: "0.1.4",
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

    const resp = await this.todoist.getActiveTasks({
      $,
      params: {
        project_id: project,
      },
    });
    const csv = converter.json2csv(resp?.results);

    const { path } = await file({
      postfix: ".csv",
    });
    await fs.promises.appendFile(path, Buffer.from(csv));

    $.export("$summary", `Successfully exported ${resp?.results?.length} task${resp?.results?.length === 1
      ? ""
      : "s"} to "${path}"`);
    return path;
  },
};
