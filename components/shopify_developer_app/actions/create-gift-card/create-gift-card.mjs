import shopify from "../../shopify_developer_app.app.mjs";
import common from "@pipedream/shopify/actions/create-gift-card/create-gift-card.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-create-gift-card",
  version: "0.0.1",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
