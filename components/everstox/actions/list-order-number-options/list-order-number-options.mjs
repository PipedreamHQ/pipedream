import everstox from "../../everstox.app.mjs";

export default {
  key: "everstox-list-order-number-options",
  name: "List Order Number Options",
  description: "Retrieves available options for the Order Number field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    everstox,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await everstox.propDefinitions.orderNumber.options.call(this.everstox, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
