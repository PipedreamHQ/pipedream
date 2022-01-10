const shopify = require("../shopify_partner.app.js");
const getAppTransactions = require("../queries/getAppTransactions");

module.exports = {
  key: "shopify_partner-new-app-charges",
  name: "New App Charges",
  type: "source",
  version: "0.0.1",
  description:
    "Emit new events when new app charges made to your partner account.",
  props: {
    shopify,
    db: "$.service.db",
    createdAtMin: {
      type: "string",
      description:
        "Only include transactions after this specific time (ISO timestamp)",
      label: "createdAtMin",
    },
    createdAtMax: {
      type: "string",
      description:
        "Only include transactions up to this specific time (ISO timestamp)",
      label: "createdAtMin",
    },
    timer: {
      description: "How often this action should run",
      type: "$.interface.timer",
      label: "timer",
      default: {
        intervalSeconds: 60 * 60,
      },
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
            summary: `New successful app charge ${txn.id} that earned ${txn.netAmount.amount} ${txn.netAmount.currencyCode}`,
          });
        });
      },
    });
  },
};
