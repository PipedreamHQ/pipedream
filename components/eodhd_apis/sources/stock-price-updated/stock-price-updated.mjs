import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import eodhdApis from "../../eodhd_apis.app.mjs";

export default {
  key: "eodhd_apis-stock-price-updated",
  name: "New Stock Price Updated",
  description: "Emit new event when historical stock prices for a specific symbol are updated.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    eodhdApis,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the EODHD API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    exchangeCode: {
      propDefinition: [
        eodhdApis,
        "exchangeCode",
      ],
    },
    symbolCode: {
      propDefinition: [
        eodhdApis,
        "symbolCode",
        ({ exchangeCode }) => ({
          exchangeCode,
        }),
      ],
    },
    fmt: {
      propDefinition: [
        eodhdApis,
        "fmt",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
  },
  async run() {
    const lastDate = this._getLastDate();

    const {
      eodhdApis,
      exchangeCode,
      symbolCode,
      fmt,
    } = this;

    const response = await eodhdApis.getLiveStockPrice({
      path: `${symbolCode}.${exchangeCode}`,
      params: {
        fmt,
      },
    });

    if (response.timestamp > lastDate) {
      this._setLastDate(response.timestamp);
    }

    const date = moment(response.timestamp).format("YYYY-MM-DD");
    this.$emit(
      response,
      {
        id: response.timestamp,
        summary: `A new stock price was updated on date ${date}!`,
        ts: response.timestamp || Date.now(),
      },
    );
  },
};
