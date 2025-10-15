import btcPayServer from "../../btcpay_server.app.mjs";

export default {
  key: "btcpay_server-get-store-on-chain-wallet-balance",
  name: "Get Store On-Chain Wallet Balance",
  description: "Fetches the balance of your on-chain store wallet. [See the documentation](https://docs.btcpayserver.org/API/Greenfield/v1/#operation/StoreOnChainWallets_ShowOnChainWalletOverview)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    btcPayServer,
    storeId: {
      propDefinition: [
        btcPayServer,
        "storeId",
      ],
    },
    cryptoCode: {
      type: "string",
      label: "Crypto Code",
      description: "The crypto code of the payment method to fetch. Example: `BTC`",
    },
  },
  async run({ $ }) {
    const response = await this.btcPayServer.getStoreWalletBalance({
      $,
      storeId: this.storeId,
      cryptoCode: this.cryptoCode,
    });
    $.export("$summary", `Fetched balance for wallet ${this.storeId}`);
    return response;
  },
};
