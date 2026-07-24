import shopify from "../../shopify_developer_app.app.mjs";
import common from "@pipedream/shopify/actions/cancel-order/cancel-order.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-cancel-order",
  version: "0.0.2",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
