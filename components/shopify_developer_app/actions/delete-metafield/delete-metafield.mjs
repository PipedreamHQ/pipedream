import metafieldActions from "../common/metafield-actions.mjs";
import common from "@pipedream/shopify/actions/delete-metafield/delete-metafield.mjs";

export default {
  ...common,
  key: "shopify_developer_app-delete-metafield",
  name: "Delete Metafield",
  description: "Deletes a metafield belonging to a resource. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafieldsDelete)",
  version: "0.0.6",
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
