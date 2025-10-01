import app from "../../hotmart.app.mjs";

export default {
  key: "hotmart-get-sales-history",
  name: "Get Sales History",
  description: "Retrieve sales history from the Hotmart account. [See the documentation](https://developers.hotmart.com/docs/pt-BR/v1/sales/sales-history/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    let results = [];
    let stop = false;

    while (!stop) {
      const {
        items, page_info: { total_results },
      } = await this.app.getSalesHistory({
        $,
        params: {
          product_id: this.productId,
          buyer_email: this.buyerEmail,
          offer_code: this.offerCode,
        },
        subscriber_code: this.subscriberCode,
      });

      results = results.concat(items);

      stop = total_results <= results.length;
    }

    $.export("$summary", `Successfully retrieved ${results.length} sale(s)`);

    return results;
  },
};
