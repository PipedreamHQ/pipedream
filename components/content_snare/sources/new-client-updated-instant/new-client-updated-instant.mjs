import contentSnare from "../../content_snare.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "content_snare-new-client-updated-instant",
  name: "New Client Updated (Instant)",
  description: "Emits an event when a client is updated in Content Snare. [See the documentation](https://api.contentsnare.com/partner_api/v1/documentation)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    contentSnare,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    clientId: {
      propDefinition: [
        contentSnare,
        "clientId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emit the 50 most recent updated clients
      const { clients } = await this.contentSnare.listClients();
      // Sort clients by updated_at in descending order to get the most recent
      clients.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      clients.slice(0, 50).forEach((client) => {
        this.$emit(client, {
          id: client.id,
          summary: `Client ${client.full_name} updated`,
          ts: Date.parse(client.updated_at),
        });
      });
    },
    async activate() {
      // Content Snare doesn't support webhooks for instant triggers, so we leave this empty
    },
    async deactivate() {
      // Content Snare doesn't support webhooks for instant triggers, so we leave this empty
    },
  },
  async run(event) {
    const { body, headers } = event;

    // Perform any necessary validation of the incoming event
    const isValidSignature = this.contentSnare.validateWebhookSignature(headers, body);
    if (!isValidSignature) {
      this.http.respond({
        status: 403,
        body: "Forbidden",
      });
      return;
    }

    // Assuming the body contains the updated client data and an ID
    const updatedClient = JSON.parse(body);
    const clientId = updatedClient.id;

    if (!clientId) {
      throw new Error(`No client ID found in the event body`);
    }

    // Emit the event for the updated client
    this.$emit(updatedClient, {
      id: updatedClient.id,
      summary: `Client ${updatedClient.full_name} updated`,
      ts: Date.parse(updatedClient.updated_at),
    });

    // Respond to the HTTP request
    this.http.respond({
      status: 200,
      body: "Event received",
    });
  },
};