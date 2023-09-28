import shopify from "../../shopify_developer_app.app.mjs";
import common from "../../../shopify/actions/create-custom-collection/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-create-custom-collection",
  name: "Create Custom Collection",
  description: "Create a new custom collection. [See the documentation](https://shopify.dev/docs/api/admin-rest/2023-01/resources/customcollection#post-custom-collections)",
  version: "0.0.2",
  type: "action",
  props: {
    shopify,
    title: {
      propDefinition: [
        shopify,
        "title",
      ],
      description: "The name of the custom collection",
    },
    products: {
      propDefinition: [
        shopify,
        "productId",
      ],
      type: "string[]",
      optional: true,
    },
    metafields: {
      propDefinition: [
        shopify,
        "metafields",
      ],
    },
    ...common.props,
  },
};
