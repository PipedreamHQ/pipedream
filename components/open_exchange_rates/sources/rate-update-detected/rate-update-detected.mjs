import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../open_exchange_rates.app.mjs";

export default {
  key: "open_exchange_rates-rate-update-detected",
  name: "New Rate Update",
  version: "0.0.1",
  description: "Emit new event when a new rate update is detected.",
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
    base: {
      propDefinition: [
        app,
        "currencyId",
      ],
      label: "Base",
      description: "Change base currency. `default: USD`",
    },
    symbols: {
      propDefinition: [
        app,
        "currencyId",
      ],
      description: "The currency symbol you want to check.",
    },
  },
  methods: {
    async startEvent() {
      const {
        app,
        symbols,
        showAlternative,
        ...params
      } = this;

      const response = await app.getLatestCurrency({
        params: {
          symbols: symbols.toString(),
          show_alternative: showAlternative,
          ...params,
        },
      });

      this.$emit(
        response,
        {
          id: response.timestamp,
          summary: `A new rate update of currency "${symbols}" was detected!`,
          ts: response.timestamp,
        },
      );
    },
  },
  async run() {
    await this.startEvent();
  },
};
