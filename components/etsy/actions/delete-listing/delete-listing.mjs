import app from "../../etsy.app.mjs";

export default {
  key: "etsy-delete-listing",
  name: "Delete Listing",
  description: "Open API V3 endpoint to delete a ShopListing. A ShopListing can be deleted only if the state is one of the following: `SOLD_OUT`, `DRAFT`, `EXPIRED`, `INACTIVE`, `ACTIVE` and `is_available` or `ACTIVE` and has seller flags: `SUPRESSED` (frozen), `VACATION`, `CUSTOM_SHOPS` (pattern), `SELL_ON_FACEBOOK`. [See the Documentation](https://developers.etsy.com/documentation/reference#operation/deleteListing)",
  type: "action",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    shopId: {
      optional: true,
      propDefinition: [
        app,
        "shopId",
      ],
    },
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
        ({
          shopId, state,
        }) => ({
          shopId,
          state,
        }),
      ],
    },
  },
  methods: {
    deleteListing({
      listingId, ...args
    }) {
      return this.app.delete({
        path: `/application/listings/${listingId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const { listingId } = this;

    await this.deleteListing({
      step,
      listingId,
    });

    step.export("$summary", `Successfully deleted listing with ID ${listingId}.`);

    return {
      success: true,
      listingId,
    };
  },
};
