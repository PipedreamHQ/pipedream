import app from "../../hotmart.app.mjs";

export default {
  key: "hotmart-get-comissions",
  name: "Get Comissions",
  description: "Get sales commission information for sale participants. [See the documentation](https://developers.hotmart.com/docs/pt-BR/v1/sales/sales-commissions/)",
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
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        app,
        "endDate",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getComissions({
      $,
      params: {
        product_id: this.productId,
        start_date: this.startDate,
        end_date: this.endDate,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.items.length} comission(s)`);

    return response;
  },
};
