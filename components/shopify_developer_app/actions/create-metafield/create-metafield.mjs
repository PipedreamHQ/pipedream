import metafieldActions from "../common/metafield-actions.mjs";
import common from "@pipedream/shopify/actions/create-metafield/create-metafield.mjs";

export default {
  ...common,
  key: "shopify_developer_app-create-metafield",
  name: "Create Metafield",
  description: "Creates a metafield belonging to a resource. [See the documentation](https://shopify.dev/docs/api/admin-graphql/latest/mutations/metafieldDefinitionCreate)",
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
