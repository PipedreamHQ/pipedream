import shopify from "../../shopify.app.mjs";
import { toSingleLineString } from "../common/common.mjs";
import common from "./common.mjs";

export default {
  ...common,
  key: "shopify-create-smart-collection",
  name: "Create Smart Collection",
  description: toSingleLineString(`
    Creates a smart collection.
    You can fill in any number of rules by selecting more than one option in each prop.
    [See documentation](https://shopify.dev/api/admin-rest/2021-10/resources/smartcollection#post-smart-collections)
  `),
  version: "0.0.11",
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
