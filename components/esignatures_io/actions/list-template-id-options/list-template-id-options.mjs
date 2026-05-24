import esignatures_io from "../../esignatures_io.app.mjs";

export default {
  key: "esignatures_io-list-template-id-options",
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
    esignatures_io,
  },
  async run({ $ }) {
    const options = await esignatures_io.propDefinitions.templateId.options
      .call(this.esignatures_io);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
