import crove_app from "../../crove_app.app.mjs";

export default {
  key: "crove_app-list-document-id-options",
  name: "List Document ID Options",
  description: "Retrieves available options for the Document ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    crove_app,
  },
  async run({ $ }) {
    const options = await crove_app.propDefinitions.document_id.options.call(this.crove_app);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
