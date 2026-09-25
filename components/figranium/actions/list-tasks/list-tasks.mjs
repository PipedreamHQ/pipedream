import app from "../../figranium.app.mjs";

export default {
  key: "figranium-list-tasks",
  name: "List Tasks",
  description: "Return all task IDs, names, and descriptions. [See the documentation](https://figranium.com/docs/api-authentication-and-secure-access).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listTasks({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response?.tasks?.length ?? 0} task(s).`);
    return response;
  },
};
