import shopify from "../../shopify_developer_app.app.mjs";
import common from "@pipedream/shopify/actions/create-custom-collection/create-custom-collection.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-create-custom-collection",
  version: "0.0.7",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
