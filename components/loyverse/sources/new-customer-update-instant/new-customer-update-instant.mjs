import loyverse from "../../loyverse.app.mjs";

export default {
  key: "loyverse-new-customer-update-instant",
  name: "New Customer Update (Instant)",
  description: "Emits an event each time a customer is updated in Loyverse. [See the documentation]",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    loyverse,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    customerId: {
      propDefinition: [
        loyverse,
        "customerId",
      ],
    },
    storeId: {
      propDefinition: [
        loyverse,
        "storeId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch the customer details to emit them as historical events
      const customerDetails = await this.loyverse.getCustomerDetails({
        customerId: this.customerId,
      });
      this.$emit(customerDetails, {
        id: customerDetails.customer_id,
        summary: `Customer ${customerDetails.customer_id} details`,
        ts: Date.parse(customerDetails.updated_at),
      });
    },
    async activate() {
      // Placeholder for webhook subscription logic
    },
    async deactivate() {
      // Placeholder for webhook unsubscription logic
    },
  },
  async run(event) {
    // Validate the incoming webhook for authenticity (not covered in this example)
    const customerUpdate = event.body;
    // Assuming customerUpdate is the updated customer details object
    this.$emit(customerUpdate, {
      id: customerUpdate.customer_id,
      summary: `Customer ${customerUpdate.customer_id} updated`,
      ts: Date.parse(customerUpdate.updated_at) || +new Date(),
    });

    // Respond to the webhook
    this.http.respond({
      status: 200,
      body: "Event processed",
    });
  },
};
