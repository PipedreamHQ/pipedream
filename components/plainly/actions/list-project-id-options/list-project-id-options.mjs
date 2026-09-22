import plainly from "../../plainly.app.mjs";

export default {
  key: "plainly-list-project-id-options",
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
    plainly,
  },
  async run({ $ }) {
    const options = await plainly.propDefinitions.projectId.options.call(this.plainly);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
