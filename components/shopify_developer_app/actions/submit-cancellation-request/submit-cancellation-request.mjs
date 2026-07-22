import shopify from "../../shopify_developer_app.app.mjs";
import common from "@pipedream/shopify/actions/submit-cancellation-request/submit-cancellation-request.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-submit-cancellation-request",
  version: "0.0.2",
  name,
  description,
  type,
  props: {
    shopify,
    ...props,
  },
};
