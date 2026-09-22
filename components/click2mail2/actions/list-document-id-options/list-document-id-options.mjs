import click2mail2 from "../../click2mail2.app.mjs";

export default {
  key: "click2mail2-list-document-id-options",
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
    click2mail2,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await click2mail2.propDefinitions.documentId.options.call(this.click2mail2, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
