import common from "../common/base.mjs";
import { ConfigurationError } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  name: "New Wallet Event (Instant)",
  key: "coinbase_developer_platform-new-wallet-event",
  description: "Emit new event for each new wallet event. [See the documentation](https://docs.cdp.coinbase.com/webhooks/cdp-sdk#external-address-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    walletAddress: {
      propDefinition: [
        common.props.coinbase,
        "walletAddress",
      ],
    },
    networkId: {
      propDefinition: [
        common.props.coinbase,
        "networkId",
      ],
    },
  },
  hooks: {
    async activate() {
      this.coinbase.configure();
      const webhook = await this.coinbase.createWebhook({
        notificationUri: this.http.endpoint,
        eventType: "wallet_activity",
        networkId: this.networkId,
        eventTypeFilter: {
          addresses: [
            this.walletAddress,
          ],
          wallet_id: "",
        },
      });

      if (!webhook?.model?.id) {
        throw new ConfigurationError("Failed to create webhook");
      }

      this._setWebhookId(webhook.model.id);
    },
    async deactivate() {
      this.coinbase.configure();
      const webhookId = this._getWebhookId();
      if (webhookId) {
        const { data: webhooks } = await this.coinbase.listWebhooks();
        const webhook = webhooks.find((webhook) => webhook.model.id === webhookId);
        await this.coinbase.deleteWebhook(webhook);
      }
    },
  },
  methods: {
    ...common.methods,
    generateMeta(body) {
      return {
        id: body.transactionHash,
        summary: `New ${body.eventType} event`,
        ts: Date.parse(body.blockTime),
      };
    },
  },
  sampleEmit,
};
