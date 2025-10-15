import app from "../../hotmart.app.mjs";

export default {
  key: "hotmart-get-comissions",
  name: "Get Comissions",
  description: "Get sales commission information for sale participants. [See the documentation](https://developers.hotmart.com/docs/pt-BR/v1/sales/sales-commissions/)",
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
    let results = [];
    let stop = false;

    while (!stop) {
      const {
        items, page_info: { total_results },
      } = await this.app.getComissions({
        $,
        params: {
          product_id: this.productId,
          start_date: this.startDate,
          end_date: this.endDate,
        },
      });

      results = results.concat(items);

      stop = total_results <= results.length;
    }

    $.export("$summary", `Successfully retrieved ${results.length} comission(s)`);

    return results;
  },
};
