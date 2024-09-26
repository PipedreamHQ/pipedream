import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import reputationLyncs from "../../reputation_lyncs.app.mjs";

export default {
  key: "reputation_lyncs-new-customer-added",
  name: "New Customer Added",
  description:
    "Emit new event when a new customer is added to the system. [See the documentation](https://documenter.getpostman.com/view/25361963/2s93Xzw2bS#5c16a301-9417-4539-b9c5-dcdf666159ff)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    reputationLyncs,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData(false);
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId");
    },
    _setLastId(value) {
      this.db.set("lastId", value);
    },
    async getAndProcessData(emit = true) {
      const lastId = this._getLastId();
      const { result } = await this.reputationLyncs.listCustomers({
        data: {
          created_after_id: lastId,
        },
      });

      let lastCustomerDate = 0, lastCustomerId;
      const ts = Date.now();
      result?.forEach?.((customer) => {
        const id = customer.customerId;

        if (emit) {
          this.$emit(customer, {
            id,
            summary: `New Customer: ${
              customer.customer_email || customer.customer_name || id
            }`,
            ts,
          });
        }

        const date = new Date(customer.created_date.split(" ").join("T") + "Z").valueOf();
        if (date > lastCustomerDate) {
          lastCustomerDate = date;
          lastCustomerId = id;
        }
      });

      if (lastCustomerId) this._setLastId(lastCustomerId);
    },
  },
  async run() {
    await this.getAndProcessData();
  },
};
