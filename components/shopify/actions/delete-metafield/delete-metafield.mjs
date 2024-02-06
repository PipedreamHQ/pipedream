import metafieldActions from "../common/metafield-actions.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "shopify-delete-metafield",
  name: "Delete Metafield",
  description: "Deletes a metafield belonging to a resource. [See the documentation](https://shopify.dev/docs/api/admin-rest/2023-01/resources/metafield#delete-blogs-blog-id-metafields-metafield-id)",
  version: "0.0.7",
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
