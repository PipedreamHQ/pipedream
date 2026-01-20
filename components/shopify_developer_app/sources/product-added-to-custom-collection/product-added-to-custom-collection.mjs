import shopify from "../../shopify_developer_app.app.mjs";
import common from "@pipedream/shopify/sources/collection-updated/collection-updated.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-product-added-to-custom-collection",
  version: "0.0.11",
  name,
  description,
  type,
  props: {
    app: shopify,
    ...props,
  },
};
