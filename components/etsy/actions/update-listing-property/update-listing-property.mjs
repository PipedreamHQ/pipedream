import app from "../../etsy.app.mjs";

export default {
  key: "etsy-update-listing-property",
  name: "Update Listing Property",
  description: "Updates or populates the properties list defining product offerings for a listing. Each offering requires both a `value` and a `value_id` that are valid for a `scale_id` assigned to the listing or that you assign to the listing with this request. [See the Documentation](https://developers.etsy.com/documentation/reference#operation/updateListingProperty)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
