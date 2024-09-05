import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-purchase",
  name: "Get Purchase",
  description: "Returns info about a purchase. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchase#read-a-purchase)",
  version: "0.1.4",
  type: "action",
  props: {
    quickbooks,
    purchaseId: {
      label: "Purchase ID",
      type: "string",
      description: "Id of the purchase to get details of.",
    },
    minorVersion: {
      propDefinition: [
        quickbooks,
        "minorVersion",
      ],
    },
  },
  async run({ $ }) {
    if (!this.purchaseId) {
      throw new ConfigurationError("Must provide purchaseId parameter.");
    }

    const response = await this.quickbooks.getPurchase({
      $,
      purchaseId: this.purchaseId,
      params: {
        minorversion: this.minorVersion,
      },
    });

    if (response) {
      $.export("summary", `Successfully retrieved purchase with id ${response.Purchase.Id}`);
    }

    return response;
  },
};
