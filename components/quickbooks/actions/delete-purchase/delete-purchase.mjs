import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-delete-purchase",
  name: "Delete Purchase",
  description: "Delete a specific purchase. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/purchase#delete-a-purchase)",
  version: "0.0.2",
  type: "action",
  props: {
    quickbooks,
    purchaseId: {
      propDefinition: [
        quickbooks,
        "purchaseId",
      ],
    },
    minorversion: {
      label: "Minor Version",
      type: "string",
      description: "Use the minorversion query parameter in REST API requests to access a version of the API other than the generally available version. For example, to invoke minor version 1 of the JournalEntry entity, issue the following request:\n`https://quickbooks.api.intuit.com/v3/company/<realmId>/journalentry/entityId?minorversion=1`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      quickbooks,
      purchaseId,
      minorversion,
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
        minorversion,
        operation: "delete",
      },
    });

    if (response) {
      $.export("summary", `Successfully deleted purchase with id ${Id}`);
    }

    return response;
  },
};
