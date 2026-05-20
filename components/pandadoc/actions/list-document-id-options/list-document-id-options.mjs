import pandadoc from "../../pandadoc.app.mjs";

export default {
  key: "pandadoc-list-document-id-options",
  name: "List Document Id Options",
  description: "Retrieves available options for the Document Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pandadoc,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await pandadoc.propDefinitions.documentId.options.call(this.pandadoc, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
