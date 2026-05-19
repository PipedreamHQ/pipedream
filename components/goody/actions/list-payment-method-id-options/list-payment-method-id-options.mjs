import goody from "../../goody.app.mjs";

export default {
  key: "goody-list-payment-method-id-options",
  name: "List Payment Method Options",
  description: "Retrieves available options for the Payment Method field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    goody,
  },
  async run({ $ }) {
    const options = await goody.propDefinitions.paymentMethodId.options.call(this.goody);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
