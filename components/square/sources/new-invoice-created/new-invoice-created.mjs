import base from "../common/base-polling.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "square-new-invoice-created",
  name: "New Invoice Created",
  description: "Emit new event for every new invoice created. [See the docs](https://developer.squareup.com/reference/square/invoices-api/search-invoices)",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    ...base.props,
    location: {
      propDefinition: [
        base.props.square,
        "location",
      ],
    },
  },
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log(`Retrieving at most last ${constants.MAX_HISTORICAL_EVENTS} objects...`);
      const { invoices } = await this.square.searchInvoices({
        data: {
          ...this.getBaseParams(),
        },
      });
      if (!(invoices?.length > 0)) {
        return;
      }
      this._setLastTs(Date.parse(invoices[0].created_at));
      invoices?.slice(0, constants.MAX_HISTORICAL_EVENTS)
        .reverse()
        .forEach((invoice) => this.$emit(invoice, this.generateMeta(invoice)));
    },
  },
  methods: {
    ...base.methods,
    getBaseParams() {
      return {
        limit: constants.MAX_LIMIT,
        query: {
          sort: {
            field: "INVOICE_SORT_DATE",
            order: "DESC",
          },
          filter: {
            location_ids: [
              this.location,
            ],
          },
        },
      };
    },
    generateMeta(invoice) {
      return {
        id: invoice.id,
        summary: `Invoice created: ${invoice.id}`,
        ts: Date.parse(invoice.created_at),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let newLastTs;
    let cursor;
    let done = false;

    do {
      const response = await this.square.searchInvoices({
        data: {
          ...this.getBaseParams(),
          cursor,
        },
      });
      const { invoices } = response;
      if (!(invoices?.length > 0)) {
        break;
      }
      if (!newLastTs) {
        newLastTs = Date.parse(invoices[0].created_at);
      }
      for (const invoice of invoices) {
        if (Date.parse(invoice.created_at) <= lastTs) {
          done = true;
          break;
        }
        this.emitEvent(invoice);
      }
      cursor = response?.cursor;
    } while (cursor && !done);

    this._setLastTs(newLastTs);
  },
};
