import app from "../../rollbar.app.mjs";

export default {
  key: "rollbar-list-projects",
  name: "List Projects",
  description: "Lists all projects in Rollbar. [See the documentation](https://docs.rollbar.com/reference/list-all-projects)",
  version: "0.0.2",
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
    const response = await this.app.listProjects({
      $,
    });

    $.export("$summary", "Successfully listed all projects");

    return response;
  },
};
