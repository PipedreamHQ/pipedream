import app from "../../pro_ledger.app.mjs";

export default {
  key: "pro_ledger-get-categories",
  name: "Get Categories",
  description: "Get categories setup information. [See the documentation](https://api.pro-ledger.com/redoc#tag/record/operation/get_categories_api_v1_record_get_categories_get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    transactionType: {
      propDefinition: [
        app,
        "transactionType",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.getCategories({
      $,
      params: {
        transactionType: this.transactionType,
      },
    });

    $.export("$summary", "Successfully retrieved categories");

    return response;
  },
};
