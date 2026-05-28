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
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
      optional: true,
    },
    productId: {
      propDefinition: [
        app,
        "productId",
      ],
    },
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Filter by active or inactive subscription",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      organizationId: this.organizationId,
      productId: this.productId,
      customerId: this.customerId,
      active: this.active,
    };
    const subscriptionList = await this.app.listSubscriptions(params);
    $.export("$summary", `Successfully retrieved ${subscriptionList?.items?.length} subscription(s)`);
    return subscriptionList;
  },
};
