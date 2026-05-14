import americommerce from "../../americommerce.app.mjs";

export default {
  key: "americommerce-list-subscription-id-options",
  name: "List Subscription ID Options",
  description: "Retrieves available options for the Subscription ID field.",
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
    const options = await americommerce.propDefinitions.subscriptionId.options
      .call(this.americommerce);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
