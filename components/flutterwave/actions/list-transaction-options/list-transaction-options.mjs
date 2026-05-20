import flutterwave from "../../flutterwave.app.mjs";

export default {
  key: "flutterwave-list-transaction-options",
  name: "List Transaction Options",
  description: "Retrieves available options for the Transaction field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    flutterwave,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await flutterwave.propDefinitions.transaction.options.call(this.flutterwave, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
