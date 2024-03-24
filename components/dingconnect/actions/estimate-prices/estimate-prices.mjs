import dingconnect from "../../dingconnect.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dingconnect-estimate-prices",
  name: "Estimate Prices",
  description: "Estimates prices for send or receive values using the DingConnect API. [See the documentation](https://www.dingconnect.com/api#operation/estimateprices)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dingconnect,
    skuCode: {
      propDefinition: [
        dingconnect,
        "skuCode",
      ],
    },
    sendValue: {
      propDefinition: [
        dingconnect,
        "sendValue",
      ],
    },
    receiveValue: {
      propDefinition: [
        dingconnect,
        "receiveValue",
      ],
    },
    accountNumber: {
      propDefinition: [
        dingconnect,
        "accountNumber",
      ],
    },
    productProviderCode: {
      propDefinition: [
        dingconnect,
        "productProviderCode",
      ],
    },
    regionCode: {
      propDefinition: [
        dingconnect,
        "regionCode",
      ],
    },
    customerReference: {
      propDefinition: [
        dingconnect,
        "customerReference",
      ],
    },
    distributorRef: {
      propDefinition: [
        dingconnect,
        "distributorRef",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dingconnect.estimatePrices({
      skuCode: this.skuCode,
      sendValue: this.sendValue,
      receiveValue: this.receiveValue,
      accountNumber: this.accountNumber,
      productProviderCode: this.productProviderCode,
      regionCode: this.regionCode,
      customerReference: this.customerReference,
      distributorRef: this.distributorRef,
    });

    $.export("$summary", `Estimated prices for provider ${this.productProviderCode}`);
    return response;
  },
};
