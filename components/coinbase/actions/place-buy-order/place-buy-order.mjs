// legacy_hash_id: a_8KiVLP
import { axios } from "@pipedream/platform";

export default {
  key: "coinbase-place-buy-order",
  name: "Place Buy Order",
  description: "Places a buy order",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      optional: true,
    },
  },
  async run({ $ }) {

    return await axios($, {
      url: `https://api.coinbase.com/v2/accounts/${this.account_id}/buys`,
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
