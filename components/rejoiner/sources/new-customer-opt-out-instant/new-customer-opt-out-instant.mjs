import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import rejoiner from "../../rejoiner.app.mjs";

export default {
  key: "rejoiner-new-customer-opt-out-instant",
  name: "New Customer Opt-Out Instant",
  description: "Emit a new event when a customer opts out of receiving communications. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    rejoiner: {
      type: "app",
      app: "rejoiner",
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
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") ?? 0;
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
  },
  hooks: {
    async deploy() {
      let lastTimestamp = this._getLastTimestamp();
      if (!lastTimestamp) {
        lastTimestamp = Date.now();
      }

      const optOutEvents = await this.rejoiner._makeRequest({
        method: "GET",
        path: "/events/opt-out",
        params: {
          limit: 50,
        },
      });

      optOutEvents.reverse();

      for (const event of optOutEvents) {
        const ts = event.timestamp
          ? Date.parse(event.timestamp)
          : Date.now();
        this.$emit(event, {
          id: event.id
            ? event.id.toString()
            : undefined,
          summary: `Customer opted out: ${event.customer_id}`,
          ts,
        });
        if (ts > lastTimestamp) {
          lastTimestamp = ts;
        }
      }

      this._setLastTimestamp(lastTimestamp);
    },
    async activate() {
      // No activation steps required
    },
    async deactivate() {
      // No deactivation steps required
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const optOutEvents = await this.rejoiner._makeRequest({
      method: "GET",
      path: "/events/opt-out",
      params: {
        since: lastTimestamp,
      },
    });

    let newLastTimestamp = lastTimestamp;

    for (const event of optOutEvents) {
      const ts = event.timestamp
        ? Date.parse(event.timestamp)
        : Date.now();
      this.$emit(event, {
        id: event.id
          ? event.id.toString()
          : undefined,
        summary: `Customer opted out: ${event.customer_id}`,
        ts,
      });
      if (ts > newLastTimestamp) {
        newLastTimestamp = ts;
      }
    }

    if (newLastTimestamp > lastTimestamp) {
      this._setLastTimestamp(newLastTimestamp);
    }
  },
};
