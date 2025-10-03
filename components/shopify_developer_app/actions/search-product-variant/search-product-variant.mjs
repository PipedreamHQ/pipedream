import shopify from "../../shopify_developer_app.app.mjs";
import common from "@pipedream/shopify/actions/search-product-variant/search-product-variant.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-search-product-variant",
  version: "0.0.10",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
