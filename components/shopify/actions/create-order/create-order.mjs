import shopify from "../../shopify.app.mjs";
import common from "./common.mjs";
import { toSingleLineString } from "../common/common.mjs";

export default {
  ...common,
  key: "shopify-create-order",
  name: "Create Order",
  description: toSingleLineString(`Creates a new order.
    For full order object details [see the docs](https://shopify.dev/api/admin-rest/2022-01/resources/order#[post]/admin/api/2022-01/orders.json)
    or [see examples](https://shopify.dev/api/admin-rest/2022-01/resources/order#[post]/admin/api/#{api_version}/orders.json_examples)
  `),
  version: "0.1.3",
  type: "action",
  props: {
    shopify,
    customerId: {
      propDefinition: [
        shopify,
        "customerId",
      ],
      optional: true,
    },
    ...common.props,
  },
};
