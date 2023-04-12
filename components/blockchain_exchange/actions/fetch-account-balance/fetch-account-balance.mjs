import app from "../../blockchain_exchange.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "blockchain_exchange-fetch-account-balance",
  name: "Fetch Account Balance",
  description: "Retrieve the user&#39;s current account balance. [See the docs](https://api.blockchain.com/v3/#/payments/getAccountByTypeAndCurrency).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
  },
  methods: {
    async getAccountBalances(args = {}) {
      const response = await this.app.sendMessage({
        action: constants.ACTION.SUBSCRIBE,
        channel: constants.CHANNEL.BALANCES,
        ...args,
      });

      if (utils.isRejected(response)) {
        throw new Error(JSON.stringify(response));
      }

      return response;
    },
  },
  async run({ $: step }) {
    const response = await this.getAccountBalances();

    step.export("$summary", "Successfully fetched account balance");

    return response;
  },
};
