import app from "../../polar.app.mjs";

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
    organisation_access_token: {
      propDefinition: [
        app,
        "organisation_access_token",
      ],
    },
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
      options: [
        {
          label: "One Time",
          value: "one_time",
        },
        {
          label: "Recurring",
          value: "recurring",
        },
      ],
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Filter by customer ID (UUID)",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number, defaults to 1",
      optional: true,
      default: 1,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Size of a page, defaults to 10. Maximum is 100.",
      optional: true,
      default: 10,
    },
  },
  async run({ $ }) {
    if (this.organisation_access_token) {
      this.app._organisationAccessTokenOverride = this.organisation_access_token;
    }
    const params = {
      page: this.page,
      limit: this.limit,
    };
    if (this.organizationId) params.organizationId = this.organizationId;
    if (this.productId) params.productId = this.productId;
    if (this.productBillingType) params.productBillingType = this.productBillingType;
    if (this.customerId) params.customerId = this.customerId;

    const { items } = await this.app.listOrders(params);
    $.export("$summary", `Successfully retrieved ${items.length} order(s)`);
    return items;
  },
};
