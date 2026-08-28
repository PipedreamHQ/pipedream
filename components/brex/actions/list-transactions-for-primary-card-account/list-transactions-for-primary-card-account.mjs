// x-pd-ai: optimized
import brexApp from "../../brex.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  name: "List Transactions for Primary Card Account",
  description: "Lists settled card transactions, unfiltered. Despite the action name, Brex returns transactions across all card accounts rather than the primary one alone, and non-admin users only ever see their own purchases, refunds, and chargebacks. Use **Search Card Transactions** instead to filter by merchant, amount, date, or cardholder and to get each transaction's `expense_id`. [See the documentation](https://developer.brex.com/openapi/transactions_api/transactions/listprimarycardtransactions)",
  key: "brex-list-transactions-for-primary-card-account",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    brexApp,
    postedAtStart: {
      propDefinition: [
        brexApp,
        "postedAtStart",
      ],
    },
    max: {
      propDefinition: [
        brexApp,
        "max",
      ],
    },
  },
};
