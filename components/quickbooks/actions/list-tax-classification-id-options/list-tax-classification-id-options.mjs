import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-list-tax-classification-id-options",
  name: "List Tax Classification ID Options",
  description: "Retrieves available options for the Tax Classification ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    quickbooks,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await quickbooks.propDefinitions.taxClassificationId.options
      .call(this.quickbooks, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
