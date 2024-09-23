import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-purchase-order",
  name: "Get Purchase Order",
  description: "Returns details about a purchase order. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchaseorder#read-a-purchase-order)",
  version: "0.1.5",
  type: "action",
  props: {
    quickbooks,
    purchaseOrderId: {
      label: "Purchase Order ID",
      type: "string",
      description: "Id of the purchase order to get details of.",
    },
    minorVersion: {
      propDefinition: [
        quickbooks,
        "minorVersion",
      ],
    },
  },
  async run({ $ }) {
    if (!this.purchaseOrderId) {
      throw new ConfigurationError("Must provide purchaseOrderId parameter.");
    }

    const response = await this.quickbooks.getPurchaseOrder({
      $,
      purchaseOrderId: this.purchaseOrderId,
      params: {
        minorversion: this.minorVersion,
      },
    });

    if (response) {
      $.export("summary", `Successfully retrieved purchase order with id ${response.PurchaseOrder.Id}`);
    }

    return response;
  },
};
