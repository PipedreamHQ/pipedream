import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import humanitix from "../../humanitix.app.mjs";

export default {
  props: {
    humanitix,
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
      return this.db.get("lastDate") || "1970-01-01T00:00:00.000Z";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    getFunction() {
      throw new Error("getFunction() must be implemented");
    },
    getSummary() {
      throw new Error("getSummary() must be implemented");
    },
    getData() {
      return {};
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const fn = this.getFunction();
      const dataField = this.getDataField();

      const response = this.humanitix.paginate({
        fn,
        ...this.getData(),
        params: {
          since: lastDate,
        },
        dataField,
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        if (Date.parse(lastDate) > Date.parse(item.createdAt)) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(responseArray[0].createdAt);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item._id,
          summary: this.getSummary(item),
          ts: Date.parse(item.createdAt),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
};
