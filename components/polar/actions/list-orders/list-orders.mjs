import app from "../../polar.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "polar-list-orders",
  name: "List Orders",
  description: "List orders according to the specified filters. [See the API docs](https://polar.sh/docs/api-reference/orders/list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "Filter by product ID (UUID)",
      optional: true,
    },
    productBillingType: {
      type: "string",
      label: "Product Billing Type",
      description: "Filter by product billing type. `recurring` for subscriptions, `one_time` for one-time purchases.",
      optional: true,
      options: constants.BILLING_TYPES,
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Filter by customer ID (UUID)",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.organizationId) params.organizationId = this.organizationId;
    if (this.productId) params.productId = this.productId;
    if (this.productBillingType) params.productBillingType = this.productBillingType;
    if (this.customerId) params.customerId = this.customerId;

    const orderList = await this.app.listOrders(params);
    $.export("$summary", `Successfully retrieved ${orderList?.items?.length} order(s)`);
    return orderList;
  },
};
