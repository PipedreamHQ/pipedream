import { axios } from "@pipedream/platform";
import overledger from "../../overledger.app.mjs";

export default {
  key: "overledger-new-contract-event-instant",
  name: "New Contract Event Instant",
  description: "Emit new event when a smart contract releases a new event. Requires specifying the contract to watch as a prop. [See the documentation](https://developers.quant.network/reference/createsmartcontractwebhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    overledger,
    db: "$.service.db",
    contractToWatch: {
      propDefinition: [
        overledger,
        "contractToWatch",
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
      // Create a webhook to receive updates for the specified smart contract
      const response = await this.overledger.createSmartContractEventWebhook({
        contractToWatch: this.contractToWatch,
        callbackUrl: this.callbackUrl,
      });

      // Store the webhook ID for later use (e.g., for deletion)
      this.db.set("webhookId", response.data.webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (!webhookId) {
        throw new Error("Webhook ID not found.");
      }

      await axios(this, {
        method: "DELETE",
        url: `https://api.sandbox.overledger.io/api/webhooks/smart-contract-events/${webhookId}`,
        headers: {
          "Authorization": `Bearer ${this.overledger.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
  },
  async run() {
    // Since this is an instant trigger, we won't poll or fetch data here.
    // The run method is implemented to comply with Pipedream's source structure.
    // Logic for handling incoming webhook requests will be managed by Pipedream's infrastructure.
  },
};
