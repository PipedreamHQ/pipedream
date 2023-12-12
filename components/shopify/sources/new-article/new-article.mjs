import shopify from "../../shopify.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "shopify-new-article",
  name: "New Article",
  type: "source",
  description: "Emit new event for each new article in a blog.",
  version: "0.0.17",
  dedupe: "unique",
  props: {
    shopify,
    ...common.props,
  },
};
