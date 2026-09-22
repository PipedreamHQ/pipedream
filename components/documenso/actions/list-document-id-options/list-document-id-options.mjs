import documenso from "../../documenso.app.mjs";

export default {
  key: "documenso-list-document-id-options",
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
    documenso,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await documenso.propDefinitions.documentId.options.call(this.documenso, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
