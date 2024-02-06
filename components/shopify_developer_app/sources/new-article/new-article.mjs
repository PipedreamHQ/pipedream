import shopify from "../../shopify_developer_app.app.mjs";
import common from "../../../shopify/sources/new-article/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-article",
  name: "New Article",
  type: "source",
  description: "Emit new event for each new article in a blog.",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    shopify,
    ...common.props,
  },
};
