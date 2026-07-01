import chargebee from "../../chargebee.app.mjs";

export default {
  key: "chargebee-list-customer-id-options",
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
    chargebee,
  },
  async run({ $ }) {
    const options = await chargebee.propDefinitions.customerId.options.call(this.chargebee, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
