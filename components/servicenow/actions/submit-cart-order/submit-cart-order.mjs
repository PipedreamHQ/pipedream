import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-submit-cart-order",
  name: "Submit Cart Order",
  description: "Submit the current user's ServiceNow cart via the `/cart/submit_order` endpoint, generating a request (REQ). Like **Checkout Cart**, the result depends on the instance's one-step vs two-step checkout configuration. Add items first with **Add Item to Cart** and inspect with **View Cart**. Use **Check Order Status** afterward to track the resulting request. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.2",
  type: "action",
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

    const requestNumber = response?.request_number ?? response?.number ?? response?.request_id;
    const summary = requestNumber
      ? `Successfully submitted cart order - request ${requestNumber}`
      : "Successfully submitted cart order";
    $.export("$summary", summary);

    return response;
  },
};
