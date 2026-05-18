import dolibarr from "../../dolibarr.app.mjs";

export default {
  key: "dolibarr-list-payment-method-code-options",
  name: "List Payment Method Code Options",
  description: "Retrieves available options for the Payment Method Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dolibarr,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await dolibarr.propDefinitions.paymentMethodCode.options.call(this.dolibarr, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
