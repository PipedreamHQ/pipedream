import fortnox from "../../fortnox.app.mjs";

export default {
  key: "fortnox-list-supplier-invoice-number-options",
  name: "List Supplier Invoice Number Options",
  description: "Retrieves available options for the Supplier Invoice Number field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fortnox,
  },
  async run({ $ }) {
    const options = await fortnox.propDefinitions.supplierInvoiceNumber.options.call(this.fortnox);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
