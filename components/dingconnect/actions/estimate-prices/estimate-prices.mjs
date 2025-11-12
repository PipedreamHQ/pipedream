import app from "../../dingconnect.app.mjs";

export default {
  key: "dingconnect-estimate-prices",
  name: "Estimate Prices",
  description: "Estimates prices send values using the DingConnect API. [See the documentation](https://www.dingconnect.com/api#operation/estimateprices)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    skuCode: {
      propDefinition: [
        app,
        "skuCode",
      ],
    },
    sendValue: {
      propDefinition: [
        app,
        "sendValue",
      ],
    },
    batchItemRef: {
      propDefinition: [
        app,
        "batchItemRef",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.estimatePrices({
      $,
      data: [
        {
          sendValue: this.sendValue,
          skuCode: this.skuCode,
          BatchItemRef: this.batchItemRef,
        },
      ],
    });

    $.export("$summary", "Successfully retrieved the estimated price");

    return response;
  },
};
