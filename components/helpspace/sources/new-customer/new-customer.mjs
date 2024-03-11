import helpspace from "../../helpspace.app.mjs";

export default {
  key: "helpspace-new-customer",
  name: "New Customer in Helpspace",
  description: "This source emits an event when a new customer signs up on Helpspace.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    helpspace,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, created_at,
      } = data;
      const ts = new Date(created_at).getTime();
      return {
        id,
        summary: `New Customer: ${id}`,
        ts,
      };
    },
  },
  async run() {
    const lastRunTime = this.db.get("lastRunTime") || this.timer.intervalSeconds;
    const now = new Date().getTime();
    const newCustomers = await this.helpspace.getNewCustomer();
    newCustomers.forEach((customer) => {
      if (new Date(customer.created_at).getTime() > lastRunTime) {
        this.$emit(customer, this.generateMeta(customer));
      }
    });
    this.db.set("lastRunTime", now);
  },
};
