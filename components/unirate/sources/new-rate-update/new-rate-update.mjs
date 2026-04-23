import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../unirate.app.mjs";

export default {
  key: "unirate-new-rate-update",
  name: "New Rate Update",
  version: "0.0.1",
  description: "Emit a new event whenever the exchange rate between two currencies changes.",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll UniRate on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    from: {
      propDefinition: [
        app,
        "currencyCode",
      ],
      label: "From",
      description: "The base currency code.",
    },
    to: {
      propDefinition: [
        app,
        "currencyCode",
      ],
      label: "To",
      description: "The target currency code.",
    },
  },
  methods: {
    _getLastRate() {
      return this.db.get("lastRate");
    },
    _setLastRate(rate) {
      this.db.set("lastRate", rate);
    },
  },
  async run() {
    const {
      app, from, to,
    } = this;

    const response = await app.getRates({
      from,
      to,
    });

    const rate = response?.rate;
    if (rate === undefined) {
      return;
    }

    const lastRate = this._getLastRate();
    if (lastRate === rate) {
      return;
    }
    this._setLastRate(rate);

    const ts = Date.now();
    this.$emit(
      {
        from,
        to,
        rate,
        previousRate: lastRate ?? null,
        ts,
      },
      {
        id: `${from}-${to}-${rate}-${ts}`,
        summary: `New rate for ${from}→${to}: ${rate}`,
        ts,
      },
    );
  },
};
