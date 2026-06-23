import zenfulfillment from "../../zenfulfillment.app.mjs";

export default {
  key: "zenfulfillment-list-order-return-id-options",
  name: "List Order Return ID Options",
  description: "Retrieves available options for the Order Return ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zenfulfillment,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await zenfulfillment.propDefinitions.orderReturnId.options
      .call(this.zenfulfillment, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
