// x-pd-ai: optimized
import brexApp from "../../brex.app.mjs";
import options from "../../common/options.mjs";
import { formatMoney } from "../../common/utils.mjs";

export default {
  key: "brex-get-expense",
  name: "Get Expense",
  description: "Retrieves one expense and its receipts. Receipt download links expire 15 minutes after the response, so download rather than store them. Use **Search Expenses** to find an expense ID. [See the documentation](https://developer.brex.com/openapi/expenses_api/expenses/getexpense)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    brexApp,
    expenseId: {
      type: "string",
      label: "Expense ID",
      description: "The ID of the expense, e.g. `expense_cmVjZWlwd`. Use **Search Expenses** to search by merchant, amount, or date, or **Search Card Transactions** to get the `expense_id` behind a card posting.",
    },
    expand: {
      type: "string[]",
      label: "Expand",
      description: "Related records to include in the response. Keep `receipts.download_uris` to get the receipt files themselves.",
      options: options.expenseExpand,
      optional: true,
      default: [
        "merchant",
        "receipts.download_uris",
        "user",
      ],
    },
  },
  async run({ $ }) {
    const expense = await this.brexApp.getExpense({
      $,
      expenseId: this.expenseId,
      params: {
        "expand[]": this.expand,
      },
    });

    const merchant = expense.merchant?.raw_descriptor ?? "Expense";
    const amount = formatMoney(expense.billing_amount) ?? "an unknown amount";
    const receiptCount = expense.receipts?.length ?? 0;
    const receiptNote = receiptCount
      ? `${receiptCount} receipt(s)`
      : "no receipt";

    $.export("$summary", `${merchant} for ${amount} — ${receiptNote}`);

    return expense;
  },
};
