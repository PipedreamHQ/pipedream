import logbrew from "../../logbrew.app.mjs";

export default {
  key: "logbrew-list-projects",
  name: "List Projects",
  description: "List the LogBrew projects your API token can read, with each project's `id`, `name`, and `is_active` state. Use it to find the project ID that **Send Log**, **List Issues**, and **Resolve Issue** take. [See the documentation](https://docs.logbrew.co/concepts/projects)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    logbrew,
  },
  async run({ $ }) {
    const projects = await this.logbrew.listProjects({
      $,
    });
    $.export("$summary", `Found ${projects.length} project${projects.length === 1
      ? ""
      : "s"}`);
    return projects;
  },
};
