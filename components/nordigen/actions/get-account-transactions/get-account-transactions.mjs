import nordigen from "../../nordigen.app.mjs";

export default {
  key: "nordigen-get-account-transactions",
  name: "Get Account Transactions",
  description: "Get the transactions of a Nordigen account. [See the docs](https://ob.nordigen.com/api/docs#/accounts/accounts_transactions_retrieve)",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nordigen,
    requisitionId: {
      propDefinition: [
        nordigen,
        "requisitionId",
      ],
    },
    accountId: {
      propDefinition: [
        nordigen,
        "accountId",
        (c) => ({
          requisitionId: c.requisitionId,
        }),
      ],
    },
    dateFrom: {
      type: "string",
      label: "Date From",
      description: "Retrieve transactions starting from this date. ISO 8601 format. Example: 2022-11-04",
      optional: true,
    },
    dateTo: {
      type: "string",
      label: "Date To",
      description: "Retrieve transactions ending with this date. ISO 8601 format. Example: 2022-11-04",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};

    if (this.dateFrom) {
      params.date_from = this.dateFrom;
    }
    if (this.dateTo) {
      params.date_to = this.dateTo;
    }

    const accountTransactions = await this.nordigen.listTransactions(this.accountId, {
      $,
      params,
    });

    if (accountTransactions.length === 0) {
      $.export("$summary", "No transactions found");
      return;
    }

    $.export("$summary", `Successfully retrieved ${accountTransactions.length} account transaction(s) for account with ID ${this.accountId}`);

    return accountTransactions;
  },
};
