import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import Booqable from "../../booqable.app.mjs";

export default {
  key: "booqable-new-customer",
  name: "New Customer",
  description: "Emits an event anytime there is a new customer",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    booqable: {
      type: "app",
      app: "booqable",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastCustomerId() {
      return this.db.get("lastCustomerId") || null;
    },
    _setLastCustomerId(id) {
      this.db.set("lastCustomerId", id);
    },
  },
  async run() {
    const lastCustomerId = this._getLastCustomerId();
    let newLastCustomerId = lastCustomerId;
    let done = false;
    let page = 1;

    while (!done) {
      const customers = await this.booqable.listCustomers({
        page,
      });
      for (const customer of customers) {
        if (customer.id === lastCustomerId) {
          done = true;
          break;
        }
        if (!newLastCustomerId || customer.id > newLastCustomerId) {
          newLastCustomerId = customer.id;
        }
        this.$emit(customer, {
          id: customer.id,
          summary: `New Customer: ${customer.name}`,
          ts: Date.parse(customer.created_at),
        });
      }
      if (customers.length < 100) {
        done = true;
      }
      page++;
    }

    this._setLastCustomerId(newLastCustomerId);
  },
};
