import help_scout from "../../help_scout.app.mjs";

export default {
  key: "help_scout-list-customer-id-options",
  name: "List Customer ID Options",
  description: "Retrieves available options for the Customer ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    help_scout,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await help_scout.propDefinitions.customerId.options.call(this.help_scout, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
