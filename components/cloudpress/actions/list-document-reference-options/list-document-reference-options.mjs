import cloudpress from "../../cloudpress.app.mjs";

export default {
  key: "cloudpress-list-document-reference-options",
  name: "List Document Reference Options",
  description: "Retrieves available options for the Document Reference field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    cloudpress,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await cloudpress.propDefinitions.documentReference.options
      .call(this.cloudpress, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
