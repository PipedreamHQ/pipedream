import alegra from "../../alegra.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "alegra-new-invoice",
  name: "New Invoice",
  description: "Emit a new event when a new invoice is created. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    alegra: {
      type: "app",
      app: "alegra",
    },
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      try {
        const webhookResponse = await this.alegra.createWebhookSubscription({
          event: "new-invoice",
          url: this.http.endpoint,
        });

        if (webhookResponse.id) {
          await this.db.set("webhookId", webhookResponse.id);
        } else {
          throw new Error("Failed to retrieve webhook subscription ID.");
        }
      } catch (error) {
        console.error("Error during activate:", error);
        throw error;
      }
    },
    async deactivate() {
      try {
        const webhookId = await this.db.get("webhookId");
        if (webhookId) {
          await this.alegra.deleteWebhookSubscription(webhookId);
          await this.db.delete("webhookId");
        }
      } catch (error) {
        console.error("Error during deactivate:", error);
      }
    },
    async deploy() {
      try {
        const invoices = await this.alegra.paginate(this.alegra.listInvoices.bind(this.alegra), {
          perPage: 50,
        });
        const recentInvoices = invoices.slice(-50);
        for (const invoice of recentInvoices) {
          this.$emit(invoice, {
            id: invoice.id,
            summary: `New invoice created: #${invoice.id}`,
            ts: Date.parse(invoice.date) || Date.now(),
          });
        }
      } catch (error) {
        console.error("Error during deploy:", error);
      }
    },
  },
  async run(event) {
    try {
      const invoice = event.body;

      if (!invoice || !invoice.id) {
        throw new Error("Invalid invoice data received.");
      }

      this.$emit(invoice, {
        id: invoice.id,
        summary: `New invoice created: #${invoice.id}`,
        ts: Date.parse(invoice.date) || Date.now(),
      });
    } catch (error) {
      console.error("Error during run:", error);
      this.http.respond({
        status: 400,
        body: "Bad Request",
      });
    }
  },
};
