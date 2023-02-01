import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import moment from "moment";
import teamgate from "../../teamgate.app.mjs";

export default {
  props: {
    teamgate,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the Teamgate API on this schedule",
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
    getFieldTime(item) {
      return item.created.time;
    },
    async processEvent(list) {
      list.reverse();
      list.forEach((item) => {
        const lastTime = this._getLastTime();
        const dateTime = this.getFieldTime(item);

        if (!lastTime || moment(dateTime).isAfter(lastTime)) this._setLastTime(dateTime);
        this.$emit(item, this.getDataToEmit(item, dateTime));
      });
    },
    getDataToEmit({
      id, name,
    }, dateTime) {
      return {
        id: id + dateTime,
        summary: this.getSummary(name, id),
        ts: dateTime,
      };
    },
    getParams() {
      const lastTime = this._getLastTime();
      return {
        "order": "createdTime:desc",
        "createdTime[gt]": lastTime,
      };
    },
  },
  hooks: {
    async activate() {
      const fn = this.getFunc();
      const { data } = await fn({
        params: {
          ...this.getParams(),
          "limit": 20,
        },
      });
      this.processEvent(data);
    },
  },
  async run() {
    const fn = this.getFunc();
    const items = this.teamgate.paginate({
      fn,
      params: this.getParams(),
    });

    const list = [];
    for await (const item of items) {
      list.push(item);
    }
    this.processEvent(list);
  },
};

