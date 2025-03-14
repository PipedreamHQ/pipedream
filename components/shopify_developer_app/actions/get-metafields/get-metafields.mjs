import metafieldActions from "../common/metafield-actions.mjs";
import common from "@pipedream/shopify/actions/get-metafields/get-metafields.mjs";
import shopify from "../../shopify_developer_app.app.mjs";

export default {
  ...common,
  key: "shopify_developer_app-get-metafields",
  name: "Get Metafields",
  description: "Retrieves a list of metafields that belong to a resource. [See the documentation](https://shopify.dev/docs/api/admin-graphql/unstable/queries/metafields)",
  version: "0.0.6",
  type: "action",
  props: {
    shopify,
    ...metafieldActions.props,
    ...common.props,
  },
  methods: {
    ...metafieldActions.methods,
    ...common.methods,
  },
};
