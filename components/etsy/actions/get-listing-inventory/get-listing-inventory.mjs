import app from "../../etsy.app.mjs";

export default {
  key: "etsy-get-listing-inventory",
  name: "Get Listing Inventory",
  description: "Retrieves the inventory record for a listing by listing ID. [See the Documentation](https://developer.etsy.com/documentation/reference/#operation/getListingInventory)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    state: {
      propDefinition: [
        app,
        "state",
      ],
    },
    listingId: {
      propDefinition: [
        app,
        "listingId",
        ({ state }) => ({
          state,
        }),
      ],
    },
  },
  async run({ $: step }) {
    const response = await this.app.getListingInventory({
      step,
      listingId: this.listingId,
    });

    step.export("$summary", `Successfully retrieved listing inventory with ID ${this.listingId}.`);

    return response;
  },
};
