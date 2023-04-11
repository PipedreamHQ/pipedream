import godial from "../../godial.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Updated Contact",
  version: "0.0.3",
  key: "godial-new-updated-contact",
  description: "Emit new event on new contact is updated.",
  type: "source",
  dedupe: "unique",
  props: {
    godial,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
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
      const payments = await this.godial.getPayments({
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
      const payments = await this.godial.getPayments({
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
