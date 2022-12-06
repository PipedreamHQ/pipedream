import common from "../../common/common.mjs";
import getAppTransactions from "../../common/queries/getAppTransactions.mjs";

export default {
  key: "shopify_partner-new-app-charges",
  name: "New App Charges",
  type: "source",
  version: "0.0.13",
  description:
    "Emit new events when new app charges made to your partner account.",
  ...common,
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
      key: "shopify_partner-transactions",
      query: getAppTransactions,
      variables,
      hasNextPagePath: "transactions.pageInfo.hasNextPage",
      getCursor: () => {
        return null;
      },
      handleEmit: (data) => {
        console.log(data.transactions.edges.map(({ node: { ...txn } }) => txn.id));

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
