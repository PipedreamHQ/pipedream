import app from "../../etsy.app.mjs";

export default {
  key: "etsy-get-listing",
  name: "Get Listing",
  description: "Retrieves a listing record by listing ID. [See the Documentation](https://developers.etsy.com/documentation/reference#operation/getListing)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  async run() {},
};
