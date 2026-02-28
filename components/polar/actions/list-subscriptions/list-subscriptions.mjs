import app from "../../polar.app.mjs";

export default {
  key: "polar-list-subscriptions",
  name: "List Subscriptions",
  description: "List subscriptions according to the specified filters. [See the API docs](https://polar.sh/docs/api-reference/subscriptions/list)",
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
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Filter by customer ID (UUID)",
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Filter by active or inactive subscription",
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
    if (this.customerId) params.customerId = this.customerId;
    if (this.active !== undefined) params.active = this.active;
    const subscriptionList = await this.app.listSubscriptions(params);
    $.export("$summary", `Successfully retrieved ${subscriptionList?.items?.length} subscription(s)`);
    return subscriptionList;
  },
};
