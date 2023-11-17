import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import knorish from "../../knorish.app.mjs";

export default {
  props: {
    knorish,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Knorish API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    getParams() {
      return {};
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();
      const items = this.knorish.paginate({
        fn: this.getFunction(),
        maxResults,
        params: {
          fromdate: moment(lastDate).format("DD-MM-YYYY"),
          todate: moment().format("DD-MM-YYYY"),
          ...this.getParams(),
        },
      });

      let responseArray = [];

      for await (const item of items) {
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastDate(responseArray[0].timestamp);

      for (const item of responseArray.reverse()) {
        this.$emit(
          item,
          {
            id: item.id,
            summary: this.getSummary(item),
            ts: item.timestamp
              ? Date.parse(item.timestamp)
              : new Date(),
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
