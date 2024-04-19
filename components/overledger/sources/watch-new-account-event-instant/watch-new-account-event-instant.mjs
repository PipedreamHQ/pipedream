import { axios } from "@pipedream/platform";
import overledger from "../../overledger.app.mjs";

export default {
  key: "overledger-watch-new-account-event-instant",
  name: "Watch New Account Event Instant",
  description: "Emit a new event for transactions to/from a specific account.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    overledger,
    db: "$.service.db",
    accountToWatch: {
      propDefinition: [
        overledger,
        "accountToWatch",
      ],
    },
    callbackUrl: {
      propDefinition: [
        overledger,
        "callbackUrl",
      ],
    },
  },
  hooks: {
    async deploy() {
      const response = await this.overledger.createAccountTransactionWebhook({
        accountToWatch: this.accountToWatch,
        callbackUrl: this.callbackUrl,
      });
      this.db.set("webhookId", response.data.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await axios(this, {
          method: "DELETE",
          url: `${this.overledger._baseUrl()}/api/webhooks/accounts/${webhookId}`,
          headers: {
            "Authorization": `Bearer ${this.overledger.$auth.oauth_access_token}`,
            "Content-Type": "application/json",
          },
        });
      }
    },
  },
  async run() {
    // Logic for processing incoming webhook events would go here.
    // In this example, since the webhook setup is external and the run method is triggered by Pipedream's scheduler,
    // you might not have much to do here unless you're processing webhook payloads stored elsewhere.
  },
};
