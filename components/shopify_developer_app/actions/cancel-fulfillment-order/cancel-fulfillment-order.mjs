import shopify from "../../shopify_developer_app.app.mjs";
import common from "@pipedream/shopify/actions/cancel-fulfillment-order/cancel-fulfillment-order.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-cancel-fulfillment-order",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
