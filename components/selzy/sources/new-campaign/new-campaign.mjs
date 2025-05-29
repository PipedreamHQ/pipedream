import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import selzy from "../../selzy.app.mjs";

export default {
  key: "selzy-new-campaign",
  name: "New Campaign Created",
  description: "Emit new event when a new email campaign is created. Useful for monitoring campaign creation activity.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    selzy,
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

      const response = this.selzy.paginate({
        fn: this.selzy.getCampaigns,
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      responseArray = responseArray.filter((item) => item.id > lastId).sort((a, b) => b.id - a.id);

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }

        this._setLastId(responseArray[0].id);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: `New campaign created: ${item.id}`,
          ts: Date.now(),
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
