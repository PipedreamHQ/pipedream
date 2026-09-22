import amazon_selling_partner from "../../amazon_selling_partner.app.mjs";

export default {
  key: "amazon_selling_partner-list-marketplace-id-options",
  name: "List Marketplace ID Options",
  description: "Retrieves available options for the Marketplace ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    amazon_selling_partner,
  },
  async run({ $ }) {
    const options = await amazon_selling_partner.propDefinitions.marketplaceId.options
      .call(this.amazon_selling_partner);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
