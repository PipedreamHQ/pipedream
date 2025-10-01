import app from "../../firmao.app.mjs";

export default {
  key: "firmao-list-tasks",
  name: "List Tasks",
  description: "List tasks from the organization. [See the documentation](https://firmao.net/API-Documentation_EN.pdf)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Search tasks with names that contains the supplied name",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      "name(contains)": this.name,
    };

    const tasks = await this.app.getTasks({
      $,
      params,
    });
    $.export("$summary", `Successfully fetched ${tasks?.data?.length} task(s)`);

    return tasks;
  },
};
