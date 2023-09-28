import shopify from "../../shopify_developer_app.app.mjs";
import common from "../../../shopify/actions/add-tags/common.mjs";

export default {
  ...common,
  name: "Add Tags",
  version: "0.0.2",
  key: "shopify_developer_app-add-tags",
  description: "Add tags. [See the documentation](https://shopify.dev/api/admin-graphql/2022-07/mutations/tagsadd)",
  type: "action",
  props: {
    shopify,
    ...common.props,
  },
};
