import shopify from "../../shopify.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "shopify-product-added-to-custom-collection",
  name: "New product added to custom collection",
  description: "Emit new event each time a product is added to a custom collection.",
  version: "0.0.5",
  type: "source",
  dedupe: "unique",
  props: {
    shopify,
    ...common.props,
  },
};
