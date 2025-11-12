import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import coinmarketcal from "../../coinmarketcal.app.mjs";

export default {
  key: "coinmarketcal-event-added",
  name: "New Event Added",
  description: "Emit new event when a new event is created.",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  props: {
    coinmarketcal,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the CoinMarketCal on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || "2017-11-25"; //First date of API events
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    emitEvent(item) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    async startEvent(maxResults) {
      const lastDate = this._getLastDate();
      const responseArray = [];
      let tempLastDate = lastDate;

      const items = this.coinmarketcal.paginate({
        fn: this.coinmarketcal.searchEvents,
        params: {
          dateRangeStart: lastDate,
          sortBy: "created_desc",
        },
        maxResults,
      });

      for await (const item of items) {
        const newLastDate = moment(item.created_date).format("YYYY-MM-DD");

        if (moment(newLastDate).isSameOrAfter(lastDate)) {
          if (moment(newLastDate).isAfter(tempLastDate)) {
            tempLastDate = newLastDate;
          }
          responseArray.push(item);
        } else {
          break;
        }
      }

      if (lastDate != tempLastDate)
        this._setLastDate(tempLastDate);

      for (const responseItem of responseArray.reverse()) {
        this.$emit(
          responseItem,
          {
            id: responseItem.id,
            summary: `A new event with title "${responseItem.title.en}" was created!`,
            ts: responseItem.created_date,
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
