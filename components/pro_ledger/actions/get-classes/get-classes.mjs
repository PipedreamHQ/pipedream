import app from "../../pro_ledger.app.mjs";

export default {
  key: "pro_ledger-get-classes",
  name: "Get Classes",
  description: "Get classes setup information. [See the documentation](https://api.pro-ledger.com/redoc#tag/record/operation/get_classes_api_v1_record_get_classes_get)",
  version: "0.1.0",
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
    const response = await this.app.getClasses({
      $,
      params: {
        transactionType: this.transactionType,
      },
    });

    $.export("$summary", "Successfully retrieved classes");

    return response;
  },
};
