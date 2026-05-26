import zoho_inventory from "../../zoho_inventory.app.mjs";

export default {
  key: "zoho_inventory-list-vendor-id-options",
  name: "List Vendor Options",
  description: "Retrieves available options for the Vendor field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_inventory,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await zoho_inventory.propDefinitions.vendorId.options
      .call(this.zoho_inventory, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
