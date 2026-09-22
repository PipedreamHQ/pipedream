import peaka from "../../peaka.app.mjs";

export default {
  key: "peaka-list-project-id-options",
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
    peaka,
  },
  async run({ $ }) {
    const options = await peaka.propDefinitions.projectId.options.call(this.peaka);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
