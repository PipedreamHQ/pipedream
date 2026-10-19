import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-submit-cart-order",
  name: "Submit Cart Order",
  description: "Submit the current user's ServiceNow cart via the `/cart/submit_order` endpoint, generating a request (REQ). Like **Checkout Cart**, the result depends on the instance's one-step vs two-step checkout configuration. Add items first with **Add Item to Cart** and inspect with **View Cart**. Use **Check Order Status** afterward to track the resulting request. Returns the request (REQ) plus a `requested_items` array with each requested item's (RITM) `number`, `approval`, `stage`, `state` and `requested_for`; approvals happen on the RITMs, so read approval status there rather than on the REQ. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.1.0",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
  },
  async run({ $ }) {
    const response = await this.servicenow.submitOrder({
      $,
    });

    const result = await this.servicenow.withRequestedItems({
      $,
      response,
    });
    $.export("$summary", `Successfully submitted cart order${this.servicenow.describeOrder(result)}`);

    return result;
  },
};
