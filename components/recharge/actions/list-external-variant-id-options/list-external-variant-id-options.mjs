import recharge from "../../recharge.app.mjs";

export default {
  key: "recharge-list-external-variant-id-options",
  name: "List External Variant ID Options",
  description: "Retrieves available options for the External Variant ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    recharge,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await recharge.propDefinitions.externalVariantId.options.call(this.recharge, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
