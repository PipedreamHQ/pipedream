import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-checkout-named-cart",
  name: "Checkout Named Cart",
  description: "Check out a named ServiceNow cart and return the checkout result. Requires the Workday Agent Cart Scripted REST API on the instance. Use this instead of **Checkout Cart** when items were added to a named cart (`cart_<plan_id>`), not the default user cart. Provide **Requested For** as a `sys_user` `sys_id` from **Find Users**. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    cartName: {
      propDefinition: [
        servicenow,
        "cartName",
      ],
    },
    requestedFor: {
      propDefinition: [
        servicenow,
        "requestedFor",
      ],
      optional: false,
      description: "`sys_id` of the requested-for user (`sys_user`). Must be a 32-character sys_id. Run **Find Users** to find it. Example: `46d44a23a9fe19810012d100cca80666`.",
    },
    deliveryAddress: {
      type: "string",
      label: "Delivery Address",
      description: "Optional delivery address to set on the named cart before checkout. Example: `123 Main St, San Francisco, CA 94105`.",
      optional: true,
    },
    specialInstructions: {
      type: "string",
      label: "Special Instructions",
      description: "Optional special instructions to set on the named cart before checkout. Example: `Leave the package at the front desk.`",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      cart_name: this.cartName,
      requested_for: this.requestedFor,
    };
    if (this.deliveryAddress) {
      data.delivery_address = this.deliveryAddress;
    }
    if (this.specialInstructions) {
      data.special_instructions = this.specialInstructions;
    }

    const response = await this.servicenow.checkoutNamedCart({
      $,
      data,
    });

    const requestNumber = response?.request_number ?? response?.number ?? response?.request_id;
    const summary = requestNumber
      ? `Successfully checked out named cart ${this.cartName} - request ${requestNumber}`
      : `Checked out named cart ${this.cartName}`;
    $.export("$summary", summary);

    return response;
  },
};
