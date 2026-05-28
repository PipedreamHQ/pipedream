import baselinker from "../../baselinker.app.mjs";

export default {
  key: "baselinker-list-order-status-id-options",
  name: "List Order Status ID Options",
  description: "Retrieves available options for the Order Status ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    baselinker,
  },
  async run({ $ }) {
    const options = await baselinker.propDefinitions.orderStatusId.options
      .call(this.baselinker, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
