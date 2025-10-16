import shopify from "../../shopify_developer_app.app.mjs";
import common from "@pipedream/shopify/actions/get-metaobjects/get-metaobjects.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-get-metaobjects",
  version: "0.0.11",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
