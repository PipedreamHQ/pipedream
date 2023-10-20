import shopify from "../../shopify_developer_app.app.mjs";
import common from "../../../shopify/actions/search-custom-collection-by-name/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-search-custom-collection-by-name",
  name: "Search Custom Collection by Name",
  description: "Search for a custom collection by name/title. [See the documentation](https://shopify.dev/docs/api/admin-rest/2023-01/resources/customcollection#get-custom-collections)",
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
    ...common.props,
  },
};
