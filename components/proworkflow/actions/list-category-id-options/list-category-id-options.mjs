import proworkflow from "../../proworkflow.app.mjs";

export default {
  key: "proworkflow-list-category-id-options",
  name: "List Category ID Options",
  description: "Retrieves available options for the Category ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    proworkflow,
  },
  async run({ $ }) {
    const options = await proworkflow.propDefinitions.categoryId.options.call(this.proworkflow);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
