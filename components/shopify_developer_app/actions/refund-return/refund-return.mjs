import shopify from "../../shopify_developer_app.app.mjs";
import common from "@pipedream/shopify/actions/refund-return/refund-return.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-refund-return",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
