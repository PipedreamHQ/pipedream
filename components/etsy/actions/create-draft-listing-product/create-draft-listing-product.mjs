import app from "../../etsy.app.mjs";

export default {
  key: "etsy-create-draft-listing-product",
  name: "Create Draft Listing Product",
  description: "Creates a physical draft listing product in a shop on the Etsy channel. [See the Documentation](https://developers.etsy.com/documentation/reference#operation/createDraftListing)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
