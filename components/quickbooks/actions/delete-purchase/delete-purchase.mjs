import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-delete-purchase",
  name: "Delete Purchase",
  description: "Delete a specific purchase. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchase#delete-a-purchase)",
  version: "0.0.11",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const purchaseId = this.purchaseId.value || this.purchaseId;

    const { Purchase: { SyncToken: syncToken } } = await this.quickbooks.getPurchase({
      $,
      purchaseId,
    });

    const response = await this.quickbooks.deletePurchase({
      $,
      data: {
        Id: purchaseId,
        SyncToken: syncToken,
      },
      params: {
        operation: "delete",
      },
    });

    if (response) {
      $.export("summary", `Successfully deleted purchase with ID ${purchaseId}`);
    }

    return response;
  },
};
