import brexApp from "../../brex_staging.app.mjs";
import common from "@pipedream/brex/actions/list-transactions-for-primary-card-account/common.mjs";

export default {
  ...common,
  name: "List Transactions for Primary Card Account",
  description: "Lists all settled transactions for the primary card account. [See the docs here](https://developer.brex.com/openapi/transactions_api/#operation/listPrimaryCardTransactions).",
  key: "brex_staging-list-transactions-for-primary-card-account",
  version: "0.0.3",
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
