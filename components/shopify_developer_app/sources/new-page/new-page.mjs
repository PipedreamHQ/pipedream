import shopify from "../../shopify_developer_app.app.mjs";
import common from "@pipedream/shopify/sources/new-page/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-new-page",
  name: "New Page",
  type: "source",
  description: "Emit new event for each new page published.",
  version: "0.0.4",
  dedupe: "unique",
  props: {
    shopify,
    ...common.props,
  },
};
