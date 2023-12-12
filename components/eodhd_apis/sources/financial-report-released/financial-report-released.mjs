import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import eodhdApis from "../../eodhd_apis.app.mjs";

export default {
  key: "eodhd_apis-financial-report-released",
  name: "New Financial Report Released",
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
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults) {
      const lastDate = this._getLastDate();
      const responseArray = [];
      let tempLastDate = lastDate;
      const {
        eodhdApis,
        exchangeCode,
        symbolCode,
      } = this;

      const items = eodhdApis.paginate({
        fn: eodhdApis.listFinancialNews,
        params: {
          s: `${symbolCode}.${exchangeCode}`,
          from: moment(lastDate).format("YYYY-MM-DD"),
        },
        maxResults,
      });

      for await (const item of items) {
        const newLastDate = moment(item.date);

        if (moment(newLastDate).isSameOrAfter(lastDate)) {
          if (moment(newLastDate).isAfter(tempLastDate)) {
            tempLastDate = newLastDate;
          }
          responseArray.push(item);
        } else {
          break;
        }
      }

      if (!moment(lastDate).isSame(tempLastDate))
        this._setLastDate(tempLastDate);

      for (const responseItem of responseArray.reverse()) {
        this.$emit(
          responseItem,
          {
            id: responseItem.date,
            summary: `A new report with title "${responseItem.title}" was created!`,
            ts: responseItem.date,
          },
        );
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
};
