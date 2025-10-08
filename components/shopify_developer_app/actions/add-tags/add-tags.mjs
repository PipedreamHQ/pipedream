import shopify from "../../shopify_developer_app.app.mjs";
import common from "@pipedream/shopify/actions/add-tags/add-tags.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-add-tags",
  version: "0.0.10",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
