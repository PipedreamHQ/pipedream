import {
  Coinbase, Webhook,
} from "@coinbase/coinbase-sdk";

export default {
  type: "app",
  app: "coinbase_developer_platform",
  propDefinitions: {
    walletAddress: {
      type: "string",
      label: "Address",
      description: "The address of the wallet to monitor. Example: `0x8fddcc0c5c993a1968b46787919cc34577d6dc5c`",
    },
    networkId: {
      type: "string",
      label: "Network ID",
      description: "The network ID of the wallet to monitor. Example: `base-mainnet`",
      async options() {
        const networks = Coinbase.networks;
        return Object.values(networks);
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
