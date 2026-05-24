import papersign from "../../papersign.app.mjs";

export default {
  key: "papersign-list-document-id-options",
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
    papersign,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await papersign.propDefinitions.documentId.options.call(this.papersign, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
