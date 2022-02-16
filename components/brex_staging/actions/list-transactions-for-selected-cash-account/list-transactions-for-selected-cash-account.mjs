import brexApp from "../../brex_staging.app.mjs";
import common from "../../../brex/actions/list-transactions-for-selected-cash-account/common.mjs";

export default {
  ...common,
  name: "List Transactions for Selected Cash Account",
  description: "Lists all transactions for the specified cash account. [See the docs here](https://developer.brex.com/openapi/transactions_api/#operation/listCashTransactions).",
  key: "brex_staging-list-transactions-for-selected-cash-account",
  version: "0.0.1",
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
