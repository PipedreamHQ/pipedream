import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-checkout-cart",
  name: "Checkout Cart",
  description: "Submit the current user's ServiceNow cart via the standard `/cart/checkout` endpoint, generating a request (REQ). The result depends on the instance's one-step vs two-step checkout configuration (in two-step mode it returns the order summary/status to confirm rather than finalizing). Add items first with **Add Item to Cart** and inspect with **View Cart**. Use **Check Order Status** afterward to track the resulting request. Returns the request (REQ) plus a `requested_items` array with each requested item's (RITM) `number`, `approval`, `stage`, `state` and `requested_for`; approvals happen on the RITMs, so read approval status there rather than on the REQ. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
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
    const response = await this.servicenow.checkoutCart({
      $,
    });

    const result = await this.servicenow.withRequestedItems({
      $,
      response,
    });
    $.export("$summary", `Successfully checked out cart${this.servicenow.describeOrder(result)}`);

    return result;
  },
};
