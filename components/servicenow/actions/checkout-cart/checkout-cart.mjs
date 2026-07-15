import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-checkout-cart",
  name: "Checkout Cart",
  description: "Submit the current user's ServiceNow cart via the standard `/cart/checkout` endpoint, generating a request (REQ). The result depends on the instance's one-step vs two-step checkout configuration (in two-step mode it returns the order summary/status to confirm rather than finalizing). Add items first with **Add Item to Cart** and inspect with **View Cart**. Use **Check Order Status** afterward to track the resulting request. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
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
    const response = await this.servicenow.checkoutCart({
      $,
    });

    const requestNumber = response?.request_number ?? response?.number ?? response?.request_id;
    const summary = requestNumber
      ? `Successfully checked out cart - request ${requestNumber}`
      : "Successfully checked out cart";
    $.export("$summary", summary);

    return response;
  },
};
