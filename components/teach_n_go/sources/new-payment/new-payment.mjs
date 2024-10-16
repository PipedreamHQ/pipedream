import teachNGo from "../../teach_n_go.app.mjs";
import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "teach_n_go-new-payment",
  name: "New Payment Made",
  description: "Emit new event when a payment is made. [See the documentation](https://intercom.help/teach-n-go/en/articles/8727904-api-endpoints)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    teachNGo: {
      type: "app",
      app: "teach_n_go",
    },
    studentName: {
      propDefinition: [
        teachNGo,
        "studentName",
      ],
    },
    amount: {
      propDefinition: [
        teachNGo,
        "amount",
      ],
    },
    paymentMethod: {
      propDefinition: [
        teachNGo,
        "paymentMethod",
      ],
      optional: true,
    },
    paymentDate: {
      propDefinition: [
        teachNGo,
        "paymentDate",
      ],
      optional: true,
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
    _getLastPaymentTimestamp() {
      return this.db.get("lastPaymentTimestamp") || 0;
    },
    _setLastPaymentTimestamp(timestamp) {
      this.db.set("lastPaymentTimestamp", timestamp);
    },
    async _fetchPayments(params) {
      return await axios(this, {
        method: "GET",
        url: `${this.teachNGo._baseUrl()}/path-to-payment-endpoint`, // Replace with actual endpoint
        headers: {
          "X-API-KEY": this.teachNGo.$auth.api_key,
        },
        params,
      });
    },
  },
  hooks: {
    async deploy() {
      const lastPaymentTimestamp = this._getLastPaymentTimestamp();
      const payments = await this._fetchPayments({
        lastPaymentTimestamp,
      });
      const recentPayments = payments.slice(0, 50);

      for (const payment of recentPayments) {
        this.$emit(payment, {
          id: payment.id,
          summary: `New Payment: ${payment.studentName}`,
          ts: Date.parse(payment.paymentDate) || Date.now(),
        });
      }

      if (recentPayments.length) {
        this._setLastPaymentTimestamp(Date.parse(recentPayments[0].paymentDate));
      }
    },
  },
  async run() {
    const lastPaymentTimestamp = this._getLastPaymentTimestamp();
    const payments = await this._fetchPayments({
      lastPaymentTimestamp,
    });

    for (const payment of payments) {
      this.$emit(payment, {
        id: payment.id,
        summary: `New Payment: ${payment.studentName}`,
        ts: Date.parse(payment.paymentDate) || Date.now(),
      });
    }

    if (payments.length) {
      this._setLastPaymentTimestamp(Date.parse(payments[0].paymentDate));
    }
  },
};
