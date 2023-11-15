import shopify from "../../shopify.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "shopify-new-abandoned-cart",
  name: "New Abandoned Cart",
  type: "source",
  description: "Emit new event each time a user abandons their cart.",
  version: "0.0.18",
  dedupe: "unique",
  props: {
    shopify,
    ...common.props,
  },
};
