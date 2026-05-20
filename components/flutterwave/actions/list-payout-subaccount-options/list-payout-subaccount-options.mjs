import flutterwave from "../../flutterwave.app.mjs";

export default {
  key: "flutterwave-list-payout-subaccount-options",
  name: "List Payout Subaccount Options",
  description: "Retrieves available options for the Payout Subaccount field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    flutterwave,
  },
  async run({ $ }) {
    const options = await flutterwave.propDefinitions.payoutSubaccount.options
      .call(this.flutterwave);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
