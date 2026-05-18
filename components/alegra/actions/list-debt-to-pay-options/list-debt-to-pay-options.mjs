import alegra from "../../alegra.app.mjs";

export default {
  key: "alegra-list-debt-to-pay-options",
  name: "List Debt to Pay Options",
  description: "Retrieves available options for the Debt to Pay field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    alegra,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await alegra.propDefinitions.debtToPay.options
      .call(this.alegra, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
