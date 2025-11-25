import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import vbout from "../../vbout.app.mjs";

export default {
  props: {
    vbout,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the vbout API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTime() {
      return this.db.get("lastTime");
    },
    _setLastTime(lastTime) {
      this.db.set("lastTime", lastTime);
    },
    getItemDate(datetime) {
      return datetime;
    },
    getLastDate(itemDate) {
      return itemDate;
    },
    async processEvent({
      params, lastDatetime, datetimeField,
    }) {
      const records = await this.getRecords(params);
      for (const item of records) {
        const itemDate = this.getItemDate(item[datetimeField]);

        if (!lastDatetime || moment(itemDate)
          .isSameOrAfter(lastDatetime)
        ) {
          lastDatetime = this.getLastDate(itemDate);
          this._setLastTime(lastDatetime);
        }
        this.$emit(item, this.getDataToEmit(item));
      }
    },
  },
  hooks: {
    async deploy() {
      const datetimeField = this.getDatetimeField();
      let lastDatetime = this._getLastTime();
      const items = await this.vbout.fetchItems({
        func: this.getItems,
        params: this.getParams({
          lastDatetime,
          limit: 20,
        }),
      });

      for (const row of items) {
        const itemDate = this.getItemDate(row[datetimeField]);

        if (!lastDatetime || moment(itemDate)
          .isSameOrAfter(lastDatetime)
        ) {
          lastDatetime = this.getLastDate(itemDate);
          this._setLastTime(lastDatetime);
          this.$emit(row, this.getDataToEmit(row));
        }
      }
    },
  },
  async run() {
    const datetimeField = this.getDatetimeField();
    const lastDatetime = this._getLastTime();
    const params = this.getParams({
      lastDatetime,
    });

    return this.processEvent({
      params,
      lastDatetime,
      datetimeField,
    });
  },
};

