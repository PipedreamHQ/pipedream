import shopify from "../../shopify_developer_app.app.mjs";
import common from "@pipedream/shopify/actions/delete-blog/delete-blog.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-delete-blog",
  version: "0.0.13",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
