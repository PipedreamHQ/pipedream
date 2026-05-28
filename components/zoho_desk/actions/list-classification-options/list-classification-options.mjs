import zoho_desk from "../../zoho_desk.app.mjs";

export default {
  key: "zoho_desk-list-classification-options",
  name: "List Classification Options",
  description: "Retrieves available options for the Classification field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_desk,
  },
  async run({ $ }) {
    const options = await zoho_desk.propDefinitions.classification.options
      .call(this.zoho_desk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
