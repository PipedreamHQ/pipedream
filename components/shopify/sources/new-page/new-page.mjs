import shopify from "../../shopify.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "shopify-new-page",
  name: "New Page",
  type: "source",
  description: "Emit new event for each new page published.",
  version: "0.0.17",
  dedupe: "unique",
  props: {
    shopify,
    ...common.props,
  },
};
