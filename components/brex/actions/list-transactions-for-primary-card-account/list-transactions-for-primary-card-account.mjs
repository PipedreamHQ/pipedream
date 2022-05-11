import brexApp from "../../brex.app.mjs";
import common from "./common.mjs";

export default {
  ...common,
  name: "List Transactions for Primary Card Account",
  description: "Lists all settled transactions for the primary card account. [See the docs here](https://developer.brex.com/openapi/transactions_api/#operation/listPrimaryCardTransactions).",
  key: "brex-list-transactions-for-primary-card-account",
  version: "0.0.2",
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
