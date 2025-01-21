import invoice_ninja from "../../invoice_ninja.app.mjs";
import crypto from "crypto";
import { axios } from "@pipedream/platform";

export default {
  key: "invoice_ninja-new-invoice-instant",
  name: "New Invoice Created",
  description: "Emit new event when a new invoice is created. [See the documentation]()", // Replace () with actual docs link if available
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
    async deploy() {
      const recentInvoices = await this.invoice_ninja.paginate(this.invoice_ninja.getInvoices, {
        sort: "created_at_desc",
        limit: 50,
      });
      for (const invoice of recentInvoices) {
        this.$emit(invoice, {
          id: invoice.id || `${invoice.number}-${invoice.created_at}`,
          summary: `New invoice created: ${invoice.number}`,
          ts: Date.parse(invoice.created_at) || Date.now(),
        });
      }
    },
    async activate() {
      const webhookUrl = this.http.endpoint;
      const webhook = await this.invoice_ninja._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          url: webhookUrl,
          event: "invoice.created",
        },
      });
      await this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.invoice_ninja._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        await this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const signature = event.headers["X-Signature"];
    const secret = this.invoice_ninja.$auth.webhook_secret;
    const hmac = crypto.createHmac("sha256", secret);
    const digest = hmac.update(event.body_raw).digest("hex");

    if (digest !== signature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const invoice = event.body;
    const id = invoice.id || `${invoice.number}-${invoice.created_at}`;
    const summary = `New invoice created: ${invoice.number}`;
    const ts = Date.parse(invoice.created_at) || Date.now();

    this.$emit(invoice, {
      id,
      summary,
      ts,
    });

    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
