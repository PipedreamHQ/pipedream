import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-purchase-order",
  name: "Get Purchase Order",
  description: "Returns details about a purchase order. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchaseorder#read-a-purchase-order)",
  version: "0.1.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    quickbooks,
    purchaseOrderId: {
      propDefinition: [
        quickbooks,
        "purchaseOrderId",
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
      params: {},
    });

    if (response) {
      $.export("summary", `Successfully retrieved purchase order with ID ${response.PurchaseOrder.Id}`);
    }

    return response;
  },
};
