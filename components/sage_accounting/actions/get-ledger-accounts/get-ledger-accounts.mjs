import app from "../../sage_accounting.app.mjs";

export default {
  key: "sage_accounting-get-ledger-accounts",
  name: "Get Ledger Accounts",
  description: "Retrieves a list of ledger accounts from Sage Accounting. [See the documentation](https://developer.sage.com/accounting/reference/accounting-setup/#tag/Ledger-Accounts/operation/getLedgerAccounts)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    ledgerAccountType: {
      propDefinition: [
        app,
        "ledgerAccountType",
      ],
    },
    itemsPerPage: {
      type: "integer",
      label: "Max Items",
      description: "Maximum number of items to return (1-200)",
      min: 1,
      max: 200,
      optional: true,
      default: 20,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to retrieve (starts from 1)",
      min: 1,
      optional: true,
      default: 1,
    },
  },
  async run({ $ }) {
    const response = await this.app.listLedgerAccounts({
      $,
      params: {
        ledger_account_type_id: this.ledgerAccountType,
        items_per_page: this.itemsPerPage,
        page: this.page,
      },
    });

    const length = response.length;

    $.export("$summary", `Successfully retrieved ${length} ledger account${length !== 1
      ? "s"
      : ""}`);
    return response;
  },
};
