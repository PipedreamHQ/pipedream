import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import ninjaone from "../../ninjaone.app.mjs";

export default {
  props: {
    ninjaone,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();

      const response = this.ninjaone.paginate({
        fn: this.ninjaone.listActivities,
        params: {
          newerThan: lastId,
          ...this.getParams(),
        },
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      responseArray = this.filterEvents(responseArray);

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastId(responseArray[0].id);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: this.getSummary(item),
          ts: Date.parse(item.activityTime || new Date()),
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
