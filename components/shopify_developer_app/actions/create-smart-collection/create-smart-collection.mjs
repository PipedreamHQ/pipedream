import shopify from "../../shopify_developer_app.app.mjs";
import { toSingleLineString } from "../../../shopify/actions/common/common.mjs";
import common from "../../../shopify/actions/create-smart-collection/common.mjs";

export default {
  ...common,
  key: "shopify_developer_app-create-smart-collection",
  name: "Create Smart Collection",
  description: toSingleLineString(`
    Creates a smart collection.
    You can fill in any number of rules by selecting more than one option in each prop.
    [See documentation](https://shopify.dev/api/admin-rest/2021-10/resources/smartcollection#post-smart-collections)
  `),
  version: "0.0.2",
  type: "action",
  props: {
    shopify,
    title: {
      propDefinition: [
        shopify,
        "title",
      ],
      description: "Title of the smart collection",
    },
    ...common.props,
  },
};
