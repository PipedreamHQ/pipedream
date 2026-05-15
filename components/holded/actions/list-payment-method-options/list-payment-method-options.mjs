import holded from "../../holded.app.mjs";

export default {
  key: "holded-list-payment-method-options",
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
    holded,
  },
  async run({ $ }) {
    const options = await holded.propDefinitions.paymentMethod.options.call(this.holded);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
