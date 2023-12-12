import metafieldActions from "../common/metafield-actions.mjs";
import common from "../../../shopify/actions/get-metafields/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-get-metafields",
  name: "Get Metafields",
  description: "Retrieves a list of metafields that belong to a resource. [See the docs](https://shopify.dev/api/admin-rest/2023-01/resources/metafield#get-metafields?metafield[owner-id]=382285388&metafield[owner-resource]=blog)",
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
