import ascora from "../../ascora.app.mjs";

export default {
  key: "ascora-list-customer-id-options",
  name: "List Customer ID Options",
  description: "Retrieves available options for the Customer ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ascora,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await ascora.propDefinitions.customerId.options
      .call(this.ascora, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
