import base from "../common/base-polling.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "square-new-customer-created",
  name: "New Customer Created",
  description: "Emit new event for every new customer created. [See the docs](https://developer.squareup.com/reference/square/customers-api/list-customers)",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    async deploy() {
      console.log(`Retrieving at most last ${constants.MAX_HISTORICAL_EVENTS} objects...`);
      const { customers } = await this.square.listCustomers({
        params: {
          ...this.getBaseParams(),
        },
      });
      if (!(customers?.length > 0)) {
        return;
      }
      this._setLastTs(Date.parse(customers[0].created_at));
      customers?.slice(0, constants.MAX_HISTORICAL_EVENTS)
        .reverse()
        .forEach((customer) => this.$emit(customer, this.generateMeta(customer)));
    },
  },
  methods: {
    ...base.methods,
    getBaseParams() {
      return {
        limit: constants.MAX_LIMIT,
        sort_field: "CREATED_AT",
        sort_order: "DESC",
      };
    },
    generateMeta(customer) {
      return {
        id: customer.id,
        summary: `Customer created: ${customer.id}`,
        ts: Date.parse(customer.created_at),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let newLastTs;
    let cursor;
    let done = false;

    do {
      const response = await this.square.listCustomers({
        params: {
          ...this.getBaseParams(),
          cursor,
        },
      });
      const { customers } = response;
      if (!(customers?.length > 0)) {
        break;
      }
      if (!newLastTs) {
        newLastTs = Date.parse(customers[0].created_at);
      }
      for (const customer of customers) {
        if (Date.parse(customer.created_at) <= lastTs) {
          done = true;
          break;
        }
        this.emitEvent(customer);
      }
      cursor = response?.cursor;
    } while (cursor && !done);

    this._setLastTs(newLastTs);
  },
};
