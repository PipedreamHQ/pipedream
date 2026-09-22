import americommerce from "../../americommerce.app.mjs";

export default {
  key: "americommerce-list-order-address-id-options",
  name: "List Order Address ID Options",
  description: "Retrieves available options for the Order Address ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    americommerce,
  },
  async run({ $ }) {
    const options = await americommerce.propDefinitions.orderAddressId.options
      .call(this.americommerce);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
