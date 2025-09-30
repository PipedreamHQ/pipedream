import browserbase from "../../browserbase.app.mjs";

export default {
  key: "browserbase-list-projects",
  name: "List Projects",
  description: "Lists all projects. [See the documentation](https://docs.browserbase.com/reference/api/list-projects)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    browserbase,
  },
  async run({ $ }) {
    const projects = await this.browserbase.listProjects({
      $,
    });
    $.export("$summary", `Successfully listed ${projects.length} project(s).`);
    return projects;
  },
};
