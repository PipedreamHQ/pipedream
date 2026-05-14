import announcekit from "../../announcekit.app.mjs";

export default {
  key: "announcekit-list-project-id-options",
  name: "List Project ID Options",
  description: "Retrieves available options for the Project ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    announcekit,
  },
  async run({ $ }) {
    const options = await announcekit.propDefinitions.projectId.options.call(this.announcekit);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
