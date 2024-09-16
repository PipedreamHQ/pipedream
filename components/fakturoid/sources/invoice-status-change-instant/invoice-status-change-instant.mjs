import fakturoid from "../../fakturoid.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "fakturoid-invoice-status-change-instant",
  name: "Fakturoid Invoice Status Change Instant",
  description: "Emit new event when an invoice status changes to 'overdue' or 'paid'. [See the documentation](https://www.fakturoid.cz/api/v3/webhooks)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    fakturoid,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    invoiceId: {
      propDefinition: [
        fakturoid,
        "invoiceId",
      ],
    },
    newStatus: {
      propDefinition: [
        fakturoid,
        "newStatus",
      ],
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      // No historical data fetching needed for this component.
    },
    async activate() {
      const config = {
        url: this.http.endpoint,
        events: [
          `invoice_${this.newStatus}`,
        ],
      };
      const response = await axios(this, {
        method: "POST",
        url: `${this.fakturoid._baseUrl()}/accounts/${this.fakturoid.$auth.account_slug}/webhooks.json`,
        data: config,
      });
      this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await axios(this, {
          method: "DELETE",
          url: `${this.fakturoid._baseUrl()}/accounts/${this.fakturoid.$auth.account_slug}/webhooks/${webhookId}.json`,
        });
        this.db.set("webhookId", null);
      }
    },
  },
  async run(event) {
    const {
      headers, body,
    } = event;

    const signature = headers["x-fakturoid-signature"];
    const generatedSignature = crypto
      .createHmac("sha256", this.fakturoid.$auth.signing_secret)
      .update(JSON.stringify(body))
      .digest("base64");

    if (signature !== generatedSignature) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
    });

    if (body.event_name === `invoice_${this.newStatus}` && body.invoice.id === parseInt(this.invoiceId)) {
      this.$emit(body, {
        id: `${body.invoice.id}-${body.event_name}-${Date.now()}`,
        summary: `Invoice ${body.invoice.id} status changed to ${this.newStatus}`,
        ts: Date.parse(body.created_at),
      });
    }
  },
};
