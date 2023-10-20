import shopify from "../../shopify_developer_app.app.mjs";
import common from "../../../shopify/sources/product-added-to-custom-collection/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-product-added-to-custom-collection",
  name: "New product added to custom collection",
  description: "Emit new event each time a product is added to a custom collection.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    shopify,
    ...common.props,
  },
};
