import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../open_exchange_rates.app.mjs";

export default {
  key: "open_exchange_rates-currency-fluctuation",
  name: "New Currency Fluctuation",
  version: "0.0.1",
  description: "Emit new event when a new significant change in a specified currency rate is detected.",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Open Exchange Rates on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    symbol: {
      propDefinition: [
        app,
        "currencyId",
      ],
      description: "The currency symbol you want to check.",
    },
    change: {
      type: "string",
      label: "Change",
      description: "The change you consider significant.",
      default: "0.50",
    },
  },
  methods: {
    _setLastChange(lastChange) {
      this.db.set("lastChange", lastChange);
    },
    _getLastChange() {
      return this.db.get("lastChange") || false;
    },
    async startEvent() {
      const {
        app,
        symbol,
        change,
      } = this;

      const response = await app.getLatestCurrency({
        params: {
          symbol: [
            symbol,
          ],
        },
      });

      const lastChange = this._getLastChange();

      if (lastChange && (
        (parseFloat(lastChange) - parseFloat(response.rates[symbol])) > parseFloat(change)
      )) {
        this.$emit(
          response,
          {
            id: response.timestamp,
            summary: `A new significant change of currency "${symbol}" was detected!`,
            ts: response.timestamp,
          },
        );
      }
      this._setLastChange(response.rates[symbol]);
    },
  },
  async run() {
    await this.startEvent();
  },
};
