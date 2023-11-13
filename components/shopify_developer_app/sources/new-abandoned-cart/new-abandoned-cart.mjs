import shopify from "../../shopify_developer_app.app.mjs";
import common from "../../../shopify/sources/new-abandoned-cart/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-abandoned-cart",
  name: "New Abandoned Cart",
  type: "source",
  description: "Emit new event each time a user abandons their cart.",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    shopify,
    ...common.props,
  },
};
