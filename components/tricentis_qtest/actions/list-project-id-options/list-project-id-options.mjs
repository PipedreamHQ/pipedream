import tricentisQtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-list-project-id-options",
  name: "List Project ID Options",
  description: "List all qTest projects accessible to the connected account. Use this to find the Project ID required by all other actions. Example: returns `[{label: \"Acme QA\", value: 1}, {label: \"Frontend Suite\", value: 2}]`.",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tricentisQtest,
  },
  async run({ $ }) {
    const projects = await this.tricentisQtest.getProjects();
    const options = (projects ?? []).map(({
      id, name,
    }) => ({
      label: name,
      value: id,
    }));
    $.export("$summary", `Successfully retrieved ${options.length} project${options.length === 1 ? "" : "s"}`);
    return options;
  },
};
