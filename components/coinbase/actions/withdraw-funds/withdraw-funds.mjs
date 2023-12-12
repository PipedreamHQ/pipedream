// legacy_hash_id: a_1WiqY1
import { axios } from "@pipedream/platform";

export default {
  key: "coinbase-withdraw-funds",
  name: "Withdraw Funds",
  description: "Withdraw funds",
  version: "0.1.1",
  type: "action",
  props: {
    coinbase: {
      type: "app",
      app: "coinbase",
    },
    account_id: {
      type: "string",
    },
    amount: {
      type: "string",
    },
    currency: {
      type: "string",
    },
    payment_method: {
      type: "string",
    },
  },
  async run({ $ }) {

    return await axios($, {
      url: `https://api.coinbase.com/v2/accounts/${this.account_id}/withdrawals`,
      headers: {
        Authorization: `Bearer ${this.coinbase.$auth.oauth_access_token}`,
      },
      data: {
        amount: this.amount,
        currency: this.currency,
        payment_method: this.payment_method,
      },
    });
  },
};
