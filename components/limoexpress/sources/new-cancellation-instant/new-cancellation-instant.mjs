import { axios } from "@pipedream/platform";
import limoexpress from "../../limoexpress.app.mjs";

export default {
  key: "limoexpress-new-cancellation-instant",
  name: "New Booking Cancellation",
  description: "Emit new event when a booking is canceled. [See the documentation](https://api.limoexpress.me/api/docs/v1)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    limoexpress,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
    async _makeRequest(opts = {}) {
      return this.limoexpress._makeRequest(opts);
    },
    async fetchCancellations(since) {
      return this._makeRequest({
        path: "/cancellations",
        method: "GET",
        params: {
          since,
        },
      });
    },
  },
  hooks: {
    async deploy() {
      const currentTime = new Date().getTime();
      const cancellations = await this.fetchCancellations(currentTime - 86400000); // fetch cancellations from the last 24 hours
      cancellations.slice(0, 50).forEach((cancellation) => {
        this.$emit(cancellation, {
          id: cancellation.id,
          summary: `New Cancellation: ${cancellation.id}`,
          ts: new Date(cancellation.cancelled_at).getTime(),
        });
      });
      if (cancellations.length > 0) {
        const latestTimestamp = Math.max(...cancellations.map((c) => new Date(c.cancelled_at).getTime()));
        this._setLastTimestamp(latestTimestamp);
      }
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const cancellations = await this.fetchCancellations(lastTimestamp);

    cancellations.forEach((cancellation) => {
      const cancellationTime = new Date(cancellation.cancelled_at).getTime();
      if (cancellationTime > lastTimestamp) {
        this.$emit(cancellation, {
          id: cancellation.id,
          summary: `New Cancellation: ${cancellation.id}`,
          ts: cancellationTime,
        });
        this._setLastTimestamp(cancellationTime);
      }
    });
  },
};
