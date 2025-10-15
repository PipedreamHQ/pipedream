import shopify from "../../shopify_developer_app.app.mjs";
import common from "@pipedream/shopify/actions/delete-article/delete-article.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-delete-article",
  version: "0.0.12",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
