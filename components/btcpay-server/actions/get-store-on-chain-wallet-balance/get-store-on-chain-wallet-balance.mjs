import paymentApp from "../../payment_app.app.mjs";

export default {
  key: "btcpay-server-get-store-on-chain-wallet-balance",
  name: "Get Store On-Chain Wallet Balance",
  description: "Fetches the balance of your on-chain store wallet.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    paymentApp,
    storeWalletId: paymentApp.propDefinitions.storeWalletId,
  },
  async run({ $ }) {
    const response = await this.paymentApp.getStoreWalletBalance({
      storeWalletId: this.storeWalletId,
    });
    $.export("$summary", `Fetched balance for wallet ${this.storeWalletId}`);
    return response;
  },
};
