import common from "../common.mjs";
import getAppTransactions from "../queries/getAppTransactions.mjs";

export default {
  key: "shopify_partner-new-app-charges",
  name: "New App Charges",
  type: "source",
  version: "0.0.1",
  description:
    "Emit new events when new app charges made to your partner account.",
  props: {
    ...common.props,
    createdAtMin: {
      type: "string",
      description:
        "Only include transactions after this specific time (ISO timestamp)",
      label: "createdAtMin",
      optional: true,
    },
    createdAtMax: {
      type: "string",
      description:
        "Only include transactions up to this specific time (ISO timestamp)",
      label: "createdAtMin",
      optional: true,
    },
  },
  dedupe: "unique",
  async run() {
    const {
      createdAtMin,
      createdAtMax,
      after,
      db,
    } = this;

    const variables = {
      ...(createdAtMin || {}),
      ...(createdAtMax || {}),
      ...(after || {}),
    };

    await this.shopify.query({
      db,
      key: this.key,
      query: getAppTransactions,
      variables,
      hasNextPagePath: "transactions.pageInfo.hasNextPage",
      cursorPath: "transactions[0].cursor",
      handleEmit: (data) => {
        data.transactions.edges.map(({ node: { ...txn } }) => {
          this.$emit(txn, {
            id: txn.id,
            summary: `Transaction ${txn.id} earned ${txn.netAmount.amount} ${txn.netAmount.currencyCode}`,
          });
        });
      },
    });
  },
};
