const shopify = require("../shopify_partner.app.js");
const getAppTransactions = require("../queries/getAppTransactions");

module.exports = {
  key: "new-app-charges",
  name: "New App Charges",
  type: "source",
  version: "0.0.1",
  description:
    "Emit new events when new app charges made to your partner account.",
  props: {
    shopify,
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
    const { createdAtMin, createdAtMax } = this;

    const variables = {
      ...(createdAtMin || {}),
      ...(createdAtMax || {}),
    };

    const data = await this.shopify.query({
      query: getAppTransactions,
      variables,
    });

    data.transactions.edges.map(({ node: { ...txn } }) => {
      this.$emit(txn, { id: txn.id });
    });
  },
};
