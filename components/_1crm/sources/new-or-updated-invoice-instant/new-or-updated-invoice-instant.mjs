import { axios } from "@pipedream/platform";
import _1crm from "../../_1crm.app.mjs";
import crypto from "crypto";

export default {
  key: "_1crm-new-or-updated-invoice-instant",
  name: "New or Updated Invoice Instant",
  description: "Emit new event when an invoice is updated or created. [See the documentation](https://demo.1crmcloud.com/api.php)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    _1crm,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    invoiceStatus: {
      propDefinition: [
        _1crm,
        "invoiceStatus",
      ],
    },
    invoiceDetails: {
      propDefinition: [
        _1crm,
        "invoiceDetails",
      ],
    },
  },
  hooks: {
    async deploy() {
      const recentInvoices = await this._1crm._makeRequest({
        method: "GET",
        path: "/data/Invoices",
        params: {
          order_by: "date_entered desc",
          limit: 50,
        },
      });

      for (const invoice of recentInvoices) {
        this.$emit(invoice, {
          id: invoice.id,
          summary: `New invoice: ${invoice.invoice_number}`,
          ts: Date.parse(invoice.date_entered),
        });
      }
    },
    async activate() {
      const webhookId = await this._1crm.createWebhook({
        type: "create_update",
        url: this.http.endpoint,
        model: "Invoices",
        filters: {
          glue: "and",
          conditions: [
            {
              field: "details",
              value: this.invoiceDetails,
            },
            {
              field: "status",
              value: this.invoiceStatus,
            },
          ],
        },
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this._1crm.updateWebhook({
        id: webhookId,
        type: "delete",
      });
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;
    const webhookSignature = headers["x-1crm-signature"];
    const secretKey = this._1crm.$auth.secret_key;
    const rawBody = JSON.stringify(body);

    const computedSignature = crypto.createHmac("sha256", secretKey).update(rawBody)
      .digest("base64");

    if (computedSignature !== webhookSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
      body: "OK",
    });

    this.$emit(body, {
      id: body.id,
      summary: `Invoice ${body.invoice_number} ${body.status === "new"
        ? "created"
        : "updated"}`,
      ts: Date.parse(body.date_modified),
    });
  },
};
