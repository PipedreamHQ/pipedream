import proabono from "../../proabono.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "proabono-new-payment-method-event-instant",
  name: "New Payment Method Event Instant",
  description: "Emit new event when a change related to a payment method occurs. [See the documentation](https://docs.proabono.com/api/)",
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
  },
  hooks: {
    async activate() {
      // No webhook creation is needed as per the ProAbono API documentation
    },
    async deactivate() {
      // No webhook deletion is needed as per the ProAbono API documentation
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Validate the incoming event
    if (headers["Content-Type"] !== "application/json") {
      this.http.respond({
        status: 400,
        body: "Invalid content type, expected application/json",
      });
      return;
    }

    // Emit the event
    this.$emit(body, {
      id: body.id,
      summary: `New payment method event for customer ${body.ReferenceCustomer}`,
      ts: Date.now(),
    });
  },
};
