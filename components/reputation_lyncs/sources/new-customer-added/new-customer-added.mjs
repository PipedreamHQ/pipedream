import reputationLyncs from "../../reputation_lyncs.app.mjs";

export default {
  key: "reputation_lyncs-new-customer-added",
  name: "New Customer Added",
  description: "Emit new event when a new customer is added to the system.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    reputationLyncs,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier for the customer.",
      optional: false,
    },
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "The name of the customer.",
      optional: true,
    },
    customerPhone: {
      type: "string",
      label: "Customer Phone",
      description: "The phone number of the customer.",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const customerDetails = await this.reputationLyncs.getCustomer({
        customerId: this.customerId,
      });
      this.$emit(customerDetails, {
        id: customerDetails.id,
        summary: `New Customer: ${customerDetails.fullName}`,
        ts: Date.parse(customerDetails.createdAt),
      });
    },
  },
  async run() {
    const customerDetails = await this.reputationLyncs.getCustomer({
      customerId: this.customerId,
    });
    const lastEmitted = this.db.get("lastEmitted") || 0;

    if (Date.parse(customerDetails.createdAt) > lastEmitted) {
      this.$emit(customerDetails, {
        id: customerDetails.id,
        summary: `New Customer: ${customerDetails.fullName}`,
        ts: Date.parse(customerDetails.createdAt),
      });
      this.db.set("lastEmitted", Date.parse(customerDetails.createdAt));
    }
  },
};
