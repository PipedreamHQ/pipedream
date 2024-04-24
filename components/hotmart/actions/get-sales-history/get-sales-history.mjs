import app from "../../hotmart.app.mjs";

export default {
  key: "hotmart-get-sales-history",
  name: "Get Sales History",
  description: "Retrieve sales history from the Hotmart account. [See the documentation](https://developers.hotmart.com/docs/pt-BR/v1/sales/sales-history/)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    productId: {
      propDefinition: [
        app,
        "productId",
      ],
    },
    buyerEmail: {
      propDefinition: [
        app,
        "buyerEmail",
      ],
    },
    offerCode: {
      propDefinition: [
        app,
        "offerCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getSalesHistory({
      $,
      params: {
        product_id: this.productId,
        buyer_email: this.buyerEmail,
        offer_code: this.offerCode,
      },
      subscriber_code: this.subscriberCode,
    });

    $.export("$summary", `Successfully retrieved ${response.items.length} sale(s)`);

    return response;
  },
};
