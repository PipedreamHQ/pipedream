import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-delete-purchase",
  name: "Delete Purchase",
  description: "Delete a specific purchase. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchase#delete-a-purchase)",
  version: "0.0.5",
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
    const {
      quickbooks,
      purchaseId,
    } = this;

    const [
      Id,
      SyncToken,
    ] = purchaseId.value.split("|");

    const response = await quickbooks.deletePurchase({
      $,
      data: {
        Id,
        SyncToken,
      },
      params: {
        operation: "delete",
      },
    });

    if (response) {
      $.export("summary", `Successfully deleted purchase with ID ${Id}`);
    }

    return response;
  },
};
