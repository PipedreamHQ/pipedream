import clear_books from "../../clear_books.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "clear_books-new-client-instant",
  name: "New Client Instant",
  description: "Emit new event when a new client is added to the system. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    clear_books: {
      type: "app",
      app: "clear_books",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    clientTagsFilter: {
      propDefinition: [
        clear_books,
        "clientTagsFilter",
      ],
    },
    clientTypesFilter: {
      propDefinition: [
        clear_books,
        "clientTypesFilter",
      ],
    },
  },
  hooks: {
    async deploy() {
      const params = {};
      if (this.clientTagsFilter && this.clientTagsFilter.length > 0) {
        params.tags = this.clientTagsFilter;
      }
      if (this.clientTypesFilter && this.clientTypesFilter.length > 0) {
        params.types = this.clientTypesFilter;
      }
      const clients = await this.clear_books.paginate(this.clear_books.listClients, params);
      const last50Clients = clients.slice(-50);
      for (const client of last50Clients) {
        this.$emit(client, {
          id: client.id || client.ts,
          summary: `New client: ${client.name}`,
          ts: client.created_at
            ? Date.parse(client.created_at)
            : Date.now(),
        });
      }
    },
    async activate() {
      try {
        const callbackUrl = this.http.endpoint;
        const data = {
          event: "client.created",
          callback_url: callbackUrl,
        };
        const response = await this.clear_books._makeRequest({
          method: "POST",
          path: "/webhooks",
          data,
        });
        const webhookId = response.id;
        await this.db.set("webhookId", webhookId);
      } catch (error) {
        throw new Error(`Failed to activate webhook: ${error.message}`);
      }
    },
    async deactivate() {
      try {
        const webhookId = await this.db.get("webhookId");
        if (webhookId) {
          await this.clear_books._makeRequest({
            method: "DELETE",
            path: `/webhooks/${webhookId}`,
          });
          await this.db.delete("webhookId");
        }
      } catch (error) {
        throw new Error(`Failed to deactivate webhook: ${error.message}`);
      }
    },
  },
  async run(event) {
    try {
      const signature = event.headers["X-Signature"];
      const rawBody = event.body_raw;
      const secret = this.clear_books.$auth.webhook_secret;

      if (secret) {
        const computedSignature = crypto.createHmac("sha256", secret).update(rawBody)
          .digest("hex");
        if (computedSignature !== signature) {
          this.http.respond({
            status: 401,
            body: "Unauthorized",
          });
          return;
        }
      }

      const client = event.body;

      // Apply Client Tags Filter
      if (this.clientTagsFilter && this.clientTagsFilter.length > 0) {
        const clientTags = client.tags || [];
        const hasMatchingTag = this.clientTagsFilter.some((tag) => clientTags.includes(tag));
        if (!hasMatchingTag) {
          await this.http.respond({
            status: 200,
            body: "No matching tags.",
          });
          return;
        }
      }

      // Apply Client Types Filter
      if (this.clientTypesFilter && this.clientTypesFilter.length > 0) {
        const clientType = client.type;
        const matchesType = this.clientTypesFilter.includes(clientType);
        if (!matchesType) {
          await this.http.respond({
            status: 200,
            body: "No matching types.",
          });
          return;
        }
      }

      // Emit the event
      this.$emit(client, {
        id: client.id || client.ts,
        summary: `New client: ${client.name}`,
        ts: client.created_at
          ? Date.parse(client.created_at)
          : Date.now(),
      });

      // Respond to the webhook
      await this.http.respond({
        status: 200,
        body: "OK",
      });
    } catch (error) {
      // Handle any unexpected errors
      await this.http.respond({
        status: 500,
        body: `Error processing webhook: ${error.message}`,
      });
      throw error;
    }
  },
};
