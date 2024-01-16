import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import omiseApp from "../../omise.app.mjs";

export default {
  props: {
    omiseApp,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate");
    },
    _setLastDate(lastDate = null) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();
      let filteredDate;

      const response = this.omiseApp.paginate({
        fn: this.omiseApp.listCharges,
        maxResults,
        filter: this.getFilter(),
        params: {
          from: lastDate,
          order: "reverse_chronological",
        },
      });

      const responseArray = [];
      for await (const {
        freezeDate, item,
      } of response) {
        if (!filteredDate && freezeDate) {
          filteredDate = freezeDate;
        }
        responseArray.push(item);
      }

      if (filteredDate) {
        this._setLastDate(filteredDate);

      } else if (responseArray.length) {
        this._setLastDate(responseArray[0].created_at);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(
          item,
          {
            id: item.id,
            summary: this.getSummary(item),
            ts: item.created_at,
          },
        );
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent();
    },
  },
  async run() {
    await this.startEvent();
  },
};
