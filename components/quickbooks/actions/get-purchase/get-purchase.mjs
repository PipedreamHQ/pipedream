import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-purchase",
  name: "Get Purchase",
  description: "Returns info about a purchase. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchase#read-a-purchase)",
  version: "0.1.13",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    quickbooks,
    purchaseId: {
      propDefinition: [
        quickbooks,
        "purchaseId",
      ],
    },
  },
  async run({ $ }) {
    if (!this.purchaseId) {
      throw new ConfigurationError("Must provide purchaseId parameter.");
    }

    const response = await this.quickbooks.getPurchase({
      $,
      purchaseId: this.purchaseId?.value ?? this.purchaseId,
    });

    if (response) {
      $.export("summary", `Successfully retrieved purchase with ID ${response.Purchase.Id}`);
    }

    return response;
  },
};
