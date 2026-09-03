// x-pd-ai: optimized
import brexApp from "../../brex.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  name: "List Transactions for Selected Cash Account",
  description: "Lists transactions on one Brex cash account — transfers, deposits, and fees — rather than card spend. Use **List Cash Accounts** to find the account ID. For card activity use **Search Card Transactions** or **List Transactions for Primary Card Account**. [See the documentation](https://developer.brex.com/openapi/transactions_api/transactions/listcashtransactions)",
  key: "brex-list-transactions-for-selected-cash-account",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    brexApp,
    cashAccount: {
      propDefinition: [
        brexApp,
        "cashAccount",
      ],
      optional: false,
    },
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
