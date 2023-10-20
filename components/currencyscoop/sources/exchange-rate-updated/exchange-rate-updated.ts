import { defineSource } from "@pipedream/types";
import app from "../../app/currencyscoop.app";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { CurrencyScoopResponse } from "../../common/types";
import { GetRatesResponse } from "../../common/types";

export default defineSource({
  key: "currencyscoop-exchange-rate-updated",
  name: "Exchange Rate Updated",
  description: "Emit new event when the exchange rate for a currency is updated [See the documentation](https://currencybeacon.com/api-documentation)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL as number,
      },
    },
    db: "$.service.db",
    base: {
      propDefinition: [
        app,
        "currency",
      ],
    },
    targetCurrency: {
      propDefinition: [
        app,
        "targetCurrency",
      ],
    },
    threshold: {
      type: "string",
      label: "Threshold",
      description:
        "If specified, a new event will only be emitted when the rate has changed by at least this amount since the last event. For example, if `Threshold` is **0.2** and the initial rate obtained is **3.0**, a new event will only be emitted when it reaches **2.8** or **3.2**.",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData();
    },
  },
  methods: {
    setLastValue(value: number) {
      this.db.set("lastValue", value);
    },
    getLastValue(): number {
      return this.db.get("lastValue");
    },
    setLastConfig(value: string) {
      this.db.set("lastConfig", value);
    },
    getLastConfig(): string {
      return this.db.get("lastConfig");
    },
    async getAndProcessData() {
      const {
        base, targetCurrency, threshold,
      } = this;

      const params = {
        $: this,
        params: {
          base,
          symbols: targetCurrency,
        },
      };

      const response = await this.app.getLatestRates(params);

      const { response: { rates } } = response;
      const value = rates[targetCurrency];

      const currentConfig = [
        base,
        targetCurrency,
      ].join();
      const lastConfig = this.getLastConfig();
      if (currentConfig === lastConfig) {
        const lastValue = this.getLastValue();
        if (lastValue) {
          const variation = Math.abs(value - lastValue);
          if (!variation || (threshold && variation < Math.abs(Number(threshold)))) return;
        }
      }

      this.setLastConfig(currentConfig);
      this.setLastValue(value);

      this.emitEvent(response);
    },
    emitEvent(data: CurrencyScoopResponse<GetRatesResponse>) {
      const {
        response: {
          date: ts, base, rates,
        },
      } = data;
      const [
        name,
        amount,
      ] = Object.entries(rates)[0];
      this.$emit(data, {
        id: ts,
        summary: `New rate: 1 ${base} = ${amount} ${name}`,
        ts,
      });
    },
  },
  async run() {
    await this.getAndProcessData();
  },
});
