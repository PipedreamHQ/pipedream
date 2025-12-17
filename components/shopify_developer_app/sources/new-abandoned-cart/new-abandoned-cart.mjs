import shopify from "../../shopify_developer_app.app.mjs";
import common from "@pipedream/shopify/sources/new-abandoned-cart/new-abandoned-cart.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-new-abandoned-cart",
  version: "0.0.11",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
