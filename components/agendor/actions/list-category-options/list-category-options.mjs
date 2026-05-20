import agendor from "../../agendor.app.mjs";

export default {
  key: "agendor-list-category-options",
  name: "List Category Options",
  description: "Retrieves available options for the Category field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    agendor,
  },
  async run({ $ }) {
    const options = await agendor.propDefinitions.category.options.call(this.agendor);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
