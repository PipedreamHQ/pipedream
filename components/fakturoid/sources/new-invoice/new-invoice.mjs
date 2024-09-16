import { axios } from "@pipedream/platform";
import fakturoid from "../../fakturoid.app.mjs";

export default {
  key: "fakturoid-new-invoice",
  name: "New Invoice Created",
  description: "Emit new event when a new invoice is created in Fakturoid. [See the documentation](https://www.fakturoid.cz/api/v3/invoices)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    fakturoid,
    db: "$.service.db",
    customerId: {
      propDefinition: [
        fakturoid,
        "customerId",
      ],
      optional: true,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    async _getInvoices(params) {
      return this.fakturoid._makeRequest({
        path: `/accounts/${this.fakturoid.$auth.account_slug}/invoices.json`,
        params,
      });
    },
    _getLastInvoiceId() {
      return this.db.get("lastInvoiceId");
    },
    _setLastInvoiceId(invoiceId) {
      this.db.set("lastInvoiceId", invoiceId);
    },
  },
  hooks: {
    async deploy() {
      const params = {
        order: "created_at desc",
        since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
      if (this.customerId) {
        params.subject_id = this.customerId;
      }
      const invoices = await this._getInvoices(params);
      invoices.slice(0, 50).forEach((invoice) => {
        this.$emit(invoice, {
          id: invoice.id,
          summary: `New invoice created: ${invoice.number}`,
          ts: Date.parse(invoice.created_at),
        });
      });
      if (invoices.length) {
        this._setLastInvoiceId(invoices[0].id);
      }
    },
  },
  async run() {
    const lastInvoiceId = this._getLastInvoiceId();
    const params = {
      order: "created_at desc",
      since_id: lastInvoiceId,
    };
    if (this.customerId) {
      params.subject_id = this.customerId;
    }

    const invoices = await this._getInvoices(params);
    if (invoices.length) {
      invoices.forEach((invoice) => {
        this.$emit(invoice, {
          id: invoice.id,
          summary: `New invoice created: ${invoice.number}`,
          ts: Date.parse(invoice.created_at),
        });
      });
      this._setLastInvoiceId(invoices[0].id);
    }
  },
};
