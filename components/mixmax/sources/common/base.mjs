import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import mixmax from "../../mixmax.app.mjs";

export default {
  props: {
    mixmax,
    db: "$.service.db",
    timer: {
      label: "Polling interval",
      description: "Pipedream will poll the MixMax API on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId");
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    getFieldTime(item) {
      return item.created.time;
    },
    async processEvent(list) {
      list.reverse();
      list.forEach((item) => {
        const newLastId = item._id;

        this._setLastId(newLastId);
        this.$emit(item, this.getDataToEmit(item));
      });
    },
    getDataToEmit({
      _id, email, name, timestamp,
    }) {
      const dateTime = timestamp || new Date().getTime();
      return {
        id: _id + dateTime,
        summary: this.getSummary({
          name,
          email,
          _id,
        }),
        ts: dateTime,
      };
    },
    getParams() {
      return {
        "sort": "(created date)",
        "sortAscending": false,
      };
    },
  },
  hooks: {
    async activate() {
      const lastId = this._getLastId();
      const fn = this.getFunc();
      const items = this.mixmax.paginate({
        fn,
        params: this.getParams(),
        lastId,
        maxResults: 20,
      });

      const list = [];
      for await (const item of items) {
        list.push(item);
      }

      this.processEvent(list);
    },
  },
  async run() {
    const lastId = this._getLastId();
    const fn = this.getFunc();
    const items = this.mixmax.paginate({
      fn,
      params: this.getParams(),
      lastId,
    });

    const list = [];
    for await (const item of items) {
      list.push(item);
    }
    this.processEvent(list);
  },
};

