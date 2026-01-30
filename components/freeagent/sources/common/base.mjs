import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { getId } from "../../common/utils.mjs";
import freeagent from "../../freeagent.app.mjs";

export default {
  props: {
    freeagent,
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
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const response = this.freeagent.paginate({
        fn: this.getFunction(),
        dataField: this.getDataField(),
        params: {
          sort: "-created_at",
        },
      });

      let responseArray = [];
      for await (const item of response) {
        if (Date.parse(item.created_at) <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(Date.parse(responseArray[0].created_at));
      }

      for (const item of responseArray.reverse()) {
        const id = getId(item.url);
        this.$emit(item, {
          id,
          summary: this.getSummary(item),
          ts: Date.parse(item.created_at || new Date()),
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
