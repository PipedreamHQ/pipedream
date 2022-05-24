import brexApp from "../../brex.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  name: "List Transactions for Selected Cash Account",
  description: "Lists all transactions for the specified cash account. [See the docs here](https://developer.brex.com/openapi/transactions_api/#operation/listCashTransactions).",
  key: "brex-list-transactions-for-selected-cash-account",
  version: "0.0.2",
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
