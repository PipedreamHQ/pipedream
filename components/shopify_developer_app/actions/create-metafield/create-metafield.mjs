import metafieldActions from "../common/metafield-actions.mjs";
import common from "../../../shopify/actions/create-metafield/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-create-metafield",
  name: "Create Metafield",
  description: "Creates a metafield belonging to a resource. [See the docs](https://shopify.dev/api/admin-rest/2023-01/resources/metafield#post-blogs-blog-id-metafields)",
  version: "0.0.2",
  type: "action",
  props: {
    ...metafieldActions.props,
    ...common.props,
  },
  methods: {
    ...metafieldActions.methods,
    ...common.methods,
  },
};
