import metafieldActions from "../common/metafield-actions.mjs";
import common from "@pipedream/shopify/actions/delete-metafield/delete-metafield.mjs";
import shopify from "../../shopify_developer_app.app.mjs";

import { adjustPropDefinitions } from "../../common/utils.mjs";

const {
  name, description, type, ...others
} = common;
const props = adjustPropDefinitions(others.props, shopify);

export default {
  ...others,
  key: "shopify_developer_app-delete-metafield",
  version: "0.0.6",
  name,
  description,
  type,
  props: {
    ...props,
    ...common.props,
  },
  methods: {
    ...metafieldActions.methods,
    ...common.methods,
  },
};
