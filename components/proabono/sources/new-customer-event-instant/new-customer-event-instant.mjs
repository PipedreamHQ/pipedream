import proabono from "../../proabono.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "proabono-new-customer-event-instant",
  name: "New Customer Event Instant",
  description: "Emit new event when a change related to a customer occurs. [See the documentation](https://docs.proabono.com/api/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    proabono,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    customerId: {
      propDefinition: [
        proabono,
        "customerId",
      ],
    },
    customerDetails: {
      propDefinition: [
        proabono,
        "customerDetails",
      ],
      optional: true,
    },
    subscriptionDetails: {
      propDefinition: [
        proabono,
        "subscriptionDetails",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const { data } = await this.proabono.createOrUpdateCustomer({
        customerId: this.customerId,
        customerDetails: this.customerDetails,
      });
      this.db.set("customerId", data.id);
    },
    async deactivate() {
      const customerId = this.db.get("customerId");
      await this.proabono.deleteCustomer(customerId);
      this.db.remove("customerId");
    },
  },
  async run(event) {
    if (event.headers["Content-Type"] !== "application/json") {
      this.http.respond({
        status: 422,
        body: "Invalid content type. Expected application/json",
      });
      return;
    }

    if (!event.body) {
      this.http.respond({
        status: 400,
        body: "Missing event body",
      });
      return;
    }

    this.$emit(event.body, {
      id: event.body.id,
      summary: `New event: ${event.body.type}`,
      ts: Date.now(),
    });

    this.http.respond({
      status: 200,
    });
  },
};
