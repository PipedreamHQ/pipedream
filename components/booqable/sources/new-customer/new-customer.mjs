import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import booqable from "../../booqable.app.mjs";

export default {
  key: "booqable-new-customer",
  name: "New Customer",
  description: "Emits a new event anytime there is a new customer",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    booqable,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getCustomerId() {
      return this.db.get("customerId") || null;
    },
    _setCustomerId(id) {
      this.db.set("customerId", id);
    },
  },
  async run() {
    let lastCustomerId = this._getCustomerId();
    const customers = await this.booqable.listCustomers();
    customers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    for (const customer of customers) {
      if (customer.id === lastCustomerId) {
        break;
      }
      if (!lastCustomerId || new Date(customer.created_at) > new Date(lastCustomerId)) {
        lastCustomerId = customer.id;
      }
      this.$emit(customer, {
        id: customer.id,
        summary: `New Customer: ${customer.name}`,
        ts: Date.parse(customer.created_at),
      });
    }

    this._setCustomerId(lastCustomerId);
  },
};
