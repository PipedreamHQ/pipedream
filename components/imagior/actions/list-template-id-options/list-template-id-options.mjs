import imagior from "../../imagior.app.mjs";

export default {
  key: "imagior-list-template-id-options",
  name: "List Template ID Options",
  description: "Retrieves available options for the Template ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    imagior,
  },
  async run({ $ }) {
    const options = await imagior.propDefinitions.templateId.options.call(this.imagior);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
