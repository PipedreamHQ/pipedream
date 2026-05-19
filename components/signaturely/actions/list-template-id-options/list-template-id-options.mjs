import signaturely from "../../signaturely.app.mjs";

export default {
  key: "signaturely-list-template-id-options",
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
    signaturely,
  },
  async run({ $ }) {
    const options = await signaturely.propDefinitions.templateId.options.call(this.signaturely);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
