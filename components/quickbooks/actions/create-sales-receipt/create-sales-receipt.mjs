import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-create-sales-receipt",
  name: "Create Sales Receipt",
  description: "Creates a sales receipt. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/salesreceipt#create-a-salesreceipt)",
  version: "0.0.3",
  type: "action",
  props: {
    quickbooks,
    lineItems: {
      propDefinition: [
        quickbooks,
        "lineItems",
      ],
    },
    currencyRefValue: {
      propDefinition: [
        quickbooks,
        "currencyRefValue",
      ],
      optional: true,
    },
    currencyRefName: {
      propDefinition: [
        quickbooks,
        "currencyRefName",
      ],
      optional: true,
    },
  },
  methods: {
    async createSalesReceipt({
      $, data,
    }) {
      return this.quickbooks._makeRequest(`company/${this.quickbooks._companyId()}/salesreceipt`, {
        method: "post",
        data,
      }, $);
    },
  },
  async run({ $ }) {
    try {
      if (typeof (this.lineItems) === "string") {
        this.lineItems = JSON.parse(this.lineItems);
      } else {
        this.lineItems = this.lineItems.map((lineItem) => typeof lineItem === "string"
          ? JSON.parse(lineItem)
          : lineItem);
      }
    } catch (error) {
      throw new ConfigurationError(`An error occurred while trying to parse the LineItems. Error: ${error}`);
    }

    const response = await this.createSalesReceipt({
      $,
      data: {
        Line: this.lineItems,
        CurrencyRef: this.currencyRefValue && {
          value: this.currencyRefValue,
          name: this.currencyRefName,
        },
      },
    });

    if (response) {
      $.export("summary", `Successfully created sales receipt with id ${response.SalesReceipt.Id}`);
    }

    return response;
  },
};
