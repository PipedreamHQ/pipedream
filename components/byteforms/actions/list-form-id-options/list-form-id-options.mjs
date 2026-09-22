import byteforms from "../../byteforms.app.mjs";

export default {
  key: "byteforms-list-form-id-options",
  name: "List Form ID Options",
  description: "Retrieves available options for the Form ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    byteforms,
  },
  async run({ $ }) {
    const options = await byteforms.propDefinitions.formId.options.call(this.byteforms);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
