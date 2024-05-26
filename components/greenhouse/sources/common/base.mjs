import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import greenhouse from "../../greenhouse.app.mjs";

export default {
  props: {
    greenhouse,
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
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(created) {
      this.db.set("lastDate", created);
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: this.getSummary(item),
        ts: item.createdAt,
      };
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();
      const response = this.greenhouse.paginate({
        fn: this.getFn(),
        dataField: this.getDataField(),
        maxResults,
      });

      const responseArray = [];
      for await (const item of response) {
        if (item.createdAt <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastDate(responseArray[0].createdAt);

      for (const item of responseArray.reverse()) {
        this.$emit(item, this.generateMeta(item));
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
