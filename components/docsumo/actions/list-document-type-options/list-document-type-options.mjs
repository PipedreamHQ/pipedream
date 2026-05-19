import docsumo from "../../docsumo.app.mjs";

export default {
  key: "docsumo-list-document-type-options",
  name: "List Document Type Options",
  description: "Retrieves available options for the Document Type field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    docsumo,
  },
  async run({ $ }) {
    const options = await docsumo.propDefinitions.documentType.options.call(this.docsumo);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
