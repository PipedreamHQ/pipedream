import app from "../../microsoft_365_planner.app.mjs";

export default {
  key: "microsoft_365_planner-list-user-tasks",
  name: "List User Tasks",
  description: "List all user tasks in Microsoft 365 Planner. [See the documentation](https://learn.microsoft.com/en-us/graph/api/planneruser-list-tasks?view=graph-rest-1.0&tabs=http)",
  version: "0.0.3",
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
    const response = await this.app.listUserTasks({
      $,
    });

    $.export("$summary", `Successfully retrieved \`${response?.value?.length}\` task(s).`);

    return response;
  },
};
