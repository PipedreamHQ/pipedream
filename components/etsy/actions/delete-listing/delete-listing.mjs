import app from "../../etsy.app.mjs";

export default {
  key: "etsy-delete-listing",
  name: "Delete Listing",
  description: "Open API V3 endpoint to delete a ShopListing. A ShopListing can be deleted only if the state is one of the following: `SOLD_OUT`, `DRAFT`, `EXPIRED`, `INACTIVE`, `ACTIVE` and `is_available` or `ACTIVE` and has seller flags: `SUPRESSED` (frozen), `VACATION`, `CUSTOM_SHOPS` (pattern), `SELL_ON_FACEBOOK`. [See the Documentation](https://developers.etsy.com/documentation/reference#operation/deleteListing)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
