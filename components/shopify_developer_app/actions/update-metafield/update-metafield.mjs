import metafieldActions from "../common/metafield-actions.mjs";
import common from "../../../shopify/actions/update-metafield/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-update-metafield",
  name: "Update Metafield",
  description: "Updates a metafield belonging to a resource. [See the docs](https://shopify.dev/api/admin-rest/2023-01/resources/metafield#put-blogs-blog-id-metafields-metafield-id)",
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
