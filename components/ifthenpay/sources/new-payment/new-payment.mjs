import { axios } from "@pipedream/platform";
import ifthenpay from "../../ifthenpay.app.mjs";

export default {
  key: "ifthenpay-new-payment",
  name: "New Payment Completed",
  description: "Emit new event when a payment is successfully completed through Ifthenpay. [See the documentation](https://ifthenpay.com/docs/en/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ifthenpay,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 1800, // Poll every 30 minutes
      },
    },
    paymentMethod: {
      propDefinition: [
        ifthenpay,
        "paymentMethod",
      ],
    },
  },
  hooks: {
    async deploy() {
      const pastEvents = await this.getCompletedPayments();
      const eventsToEmit = pastEvents.slice(0, 50);

      for (const event of eventsToEmit) {
        this.$emit(event, {
          id: event.requestId,
          summary: `New Payment: ${event.amount} ${event.entity}`,
          ts: Date.parse(event.paymentDate),
        });
      }

      if (eventsToEmit.length > 0) {
        this.setLastProcessedTimestamp(eventsToEmit[0].paymentDate);
      }
    },
  },
  methods: {
    async getCompletedPayments() {
      const lastProcessedTimestamp = this.getLastProcessedTimestamp();
      const payments = await this.ifthenpay._makeRequest({
        method: "POST",
        path: "/v2/payments/read",
        data: {
          boKey: this.ifthenpay.$auth.api_key,
          entity: this.paymentMethod,
          dateStart: new Date(lastProcessedTimestamp).toISOString(),
        },
      });
      return payments.payments;
    },
    getLastProcessedTimestamp() {
      return this.db.get("lastProcessedTimestamp") || Date.now() - 86400000;
    },
    setLastProcessedTimestamp(ts) {
      this.db.set("lastProcessedTimestamp", new Date(ts).toISOString());
    },
  },
  async run() {
    const completedPayments = await this.getCompletedPayments();

    for (const payment of completedPayments) {
      this.$emit(payment, {
        id: payment.requestId,
        summary: `New Payment: ${payment.amount} ${payment.entity}`,
        ts: Date.parse(payment.paymentDate),
      });
    }

    if (completedPayments.length > 0) {
      this.setLastProcessedTimestamp(completedPayments[0].paymentDate);
    }
  },
};
