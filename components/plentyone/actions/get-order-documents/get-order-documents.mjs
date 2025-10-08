import plentyone from "../../plentyone.app.mjs";

export default {
  key: "plentyone-get-order-documents",
  name: "Get Order Documents",
  description: "Retrieves documents for a specific order from PlentyONE. [See the documentation](https://developers.plentymarkets.com/en-gb/plentymarkets-rest-api/index.html#/Document/get_rest_orders_documents_find)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    plentyone,
    orderId: {
      propDefinition: [
        plentyone,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.plentyone.getOrderDocuments({
      $,
      params: {
        orderId: this.orderId,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.entries.length} documents for order: ${this.orderId}`);
    return response;
  },
};
