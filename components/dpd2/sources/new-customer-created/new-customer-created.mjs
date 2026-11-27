import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dpd2-new-customer-created",
  name: "New Customer Created",
  description: "Emit new event when someone buys from any of your stores for the first time. [See the documentation](https://docs.getdpd.com/api/reference/operations/listcustomers/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getRecords(since) {
      return this.dpd2.listAll({
        fn: this.dpd2.listCustomers,
        params: {
          date_min: since || this.dpd2.toIsoDate(Date.now() / 1000 - 30 * 86400),
        },
        maxPages: Infinity,
      });
    },
    generateMeta(customer) {
      return {
        id: customer.id,
        summary: `New customer ${customer.email}`,
        ts: Number(customer.created_at) * 1000,
      };
    },
  },
  sampleEmit,
};
