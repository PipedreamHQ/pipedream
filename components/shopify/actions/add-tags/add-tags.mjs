import shopify from "../../shopify.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  name: "Add Tags",
  version: "0.0.11",
  key: "shopify-add-tags",
  description: "Add tags. [See the documentation](https://shopify.dev/api/admin-graphql/2022-07/mutations/tagsadd)",
  type: "action",
  props: {
    shopify,
    ...common.props,
  },
};
