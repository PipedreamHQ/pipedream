import app from "../../plaid.app.mjs";

export default {
  key: "plaid-get-transactions",
  name: "Get Transactions",
  description: "Retrieves user-authorized transaction data for a specified date range. [See the documentation](https://plaid.com/docs/api/products/transactions/#transactionsget)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    accessToken: {
      propDefinition: [
        app,
        "accessToken",
      ],
    },
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        app,
        "endDate",
      ],
    },
    accountIds: {
      type: "string[]",
      label: "Account IDs",
      description: "A list of `account_ids` to retrieve for the Item. Note: An error will be returned if a provided `account_id` is not associated with the Item.",
      propDefinition: [
        app,
        "accountId",
        ({ accessToken }) => ({
          accessToken,
        }),
      ],
    },
    includeOriginalDescription: {
      type: "boolean",
      label: "Include Original Description",
      description: "Include the raw unparsed transaction description from the financial institution.",
      default: false,
      optional: true,
    },
    daysRequested: {
      type: "integer",
      label: "Days Requested",
      description: "Number of days of transaction history to request from the financial institution. Only applies when Transactions product hasn't been initialized. Min: 1, Max: 730, Default: 90.",
      min: 1,
      max: 730,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      accessToken,
      startDate,
      endDate,
      accountIds,
      includeOriginalDescription,
      daysRequested,
    } = this;

    const options = {};

    if (accountIds?.length) {
      options.account_ids = accountIds;
    }

    if (includeOriginalDescription !== undefined) {
      options.include_original_description = includeOriginalDescription;
    }

    if (daysRequested) {
      options.days_requested = daysRequested;
    }

    const transactions = await app.paginate({
      resourcesFn: app.getTransactions,
      resourcesFnArgs: {
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
        ...(Object.keys(options).length > 0 && {
          options,
        }),
      },
      resourceName: "transactions",
    });

    const transactionCount = transactions?.length || 0;
    $.export("$summary", `Successfully retrieved ${transactionCount} transactions from ${startDate} to ${endDate}`);

    return transactions;
  },
};
