import webinargeek from "../../webinargeek.app.mjs";

export default {
  name: "New Payment",
  version: "0.0.2",
  key: "webinargeek-new-payment",
  description: "Emit new event on each new payment.",
  type: "source",
  dedupe: "unique",
  props: {
    webinargeek,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  methods: {
    emitEvent(body) {
      const data = body?.entity ?? body;

      this._setLastPaymentId(data.id);

      this.$emit(data, {
        id: data.id,
        summary: `New payment with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    _setLastPaymentId(id) {
      this.db.set("lastPaymentId", id);
    },
    _getLastPaymentId() {
      return this.db.get("lastPaymentId");
    },
  },
  hooks: {
    async deploy() {
      const payments = await this.webinargeek.getPayments({
        params: {
          per_page: 10,
        },
      });

      payments.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    const lastPaymentId = this._getLastPaymentId();

    let page = 1;

    while (page >= 0) {
      const payments = await this.webinargeek.getPayments({
        params: {
          page,
          per_page: 100,
        },
      });

      payments.reverse().forEach(this.emitEvent);

      if (
        payments.length < 100 ||
        payments.filter((payment) => payment.id === lastPaymentId)
      ) {
        return;
      }

      page++;
    }
  },
};
