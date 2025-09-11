import {
  Coinbase, Wallet, Webhook,
} from "@coinbase/coinbase-sdk";

export default {
  type: "app",
  app: "coinbase_developer_platform",
  propDefinitions: {
    walletId: {
      type: "string",
      label: "Wallet ID",
      description: "The ID of the wallet to use",
      async options() {
        this.configure();
        const { data } = await this.listWallets();
        return data?.map((wallet) => ({
          label: `${wallet.model.network_id} - ${wallet.model.default_address.wallet_id}`,
          value: wallet.model.default_address.wallet_id,
        })) || [];
      },
    },
  },
  methods: {
    configure() {
      const apiKeyName = this.$auth.api_key_id;
      const privateKey = this.$auth.secret_key;
      Coinbase.configure({
        apiKeyName,
        privateKey,
      });
    },
    getWallet(walletId) {
      return Wallet.fetch(walletId);
    },
    listWallets() {
      return Wallet.listWallets();
    },
    listWebhooks() {
      return Webhook.list();
    },
    createWebhook(opts) {
      return Webhook.create(opts);
    },
    deleteWebhook(webhook) {
      return webhook.delete();
    },
  },
};
