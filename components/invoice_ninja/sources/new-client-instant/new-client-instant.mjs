import invoice_ninja from "../../invoice_ninja.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "invoice_ninja-new-client-instant",
  name: "New Client (Instant)",
  description: "Emit new event when a new client is added. [See the documentation](https://api.invoiceninja.com/docs)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    invoice_ninja: {
      type: "app",
      app: "invoice_ninja",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhookURL = this.http.endpoint;
      const secret = crypto.randomBytes(32).toString("hex");
      await this.db.set("webhookSecret", secret);
      const response = await this.invoice_ninja._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          event: "client.created",
          url: webhookURL,
          secret: secret,
        },
      });
      const webhookId = response.id;
      await this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.invoice_ninja._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        await this.db.delete("webhookId");
      }
      await this.db.delete("webhookSecret");
    },
    async deploy() {
      const clients = await this.paginate(this.invoice_ninja.getClients, {
        limit: 50,
      });
      for (const client of clients.reverse()) {
        this.$emit(client, {
          id: client.id,
          summary: `New client: ${client.name}`,
          ts: Date.parse(client.created_at) || Date.now(),
        });
      }
    },
  },
  async run(event) {
    const secret = await this.db.get("webhookSecret");
    const signature = event.headers["X-Signature"] || event.headers["x-signature"];
    const rawBody = JSON.stringify(event.body);
    const computedSignature = crypto.createHmac("sha256", secret).update(rawBody)
      .digest("hex");
    if (computedSignature !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const client = event.body;
    const timestamp = Date.parse(client.created_at) || Date.now();

    this.$emit(client, {
      id: client.id,
      summary: `New client: ${client.name}`,
      ts: timestamp,
    });

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
