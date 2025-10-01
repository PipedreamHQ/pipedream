import loyverse from "../../loyverse.app.mjs";

export default {
  key: "loyverse-get-customer",
  name: "Get Customer(s)",
  description: "Retrieves details of one or more customers. [See the documentation](https://developer.loyverse.com/docs/#tag/Customers/paths/~1customers/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    loyverse,
    customerId: {
      propDefinition: [
        loyverse,
        "customerId",
      ],
    },
    customerAmount: {
      propDefinition: [
        loyverse,
        "customerAmount",
      ],
    },
  },
  async run({ $ }) {
    const {
      loyverse, customerId, customerAmount,
    } = this;
    let response, summary;
    if (customerId) {
      response = await loyverse.getCustomerDetails({
        $,
        customerId,
      });
      summary = `Successfully retrieved data for customer ${response.email}`;
    } else {
      response = await loyverse.listCustomers({
        $,
        params: {
          limit: customerAmount,
        },
      });
      summary = `Successfully retrieved data for ${response.length} customers`;
    }
    $.export("$summary", summary);
    return response;
  },
};
