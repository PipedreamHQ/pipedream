import shopify from "../../shopify_developer_app.app.mjs";
import common from "@pipedream/shopify/actions/update-product-variant/update-product-variant.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-update-product-variant",
  version: "0.0.13",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
