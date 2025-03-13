import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import gem from "../../gem.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "gem-new-candidate",
  name: "New Candidate Added",
  description: "Emit new event when a candidate is added in Gem. [See the documentation](https://api.gem.com/v0/reference#tag/Candidates/paths/~1v0~1candidates/get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    gem,
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
      return this.db.get("lastDate") || 1;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();

      const response = this.gem.paginate({
        fn: this.gem.listCandidates,
        params: {
          created_after: lastDate,
        },
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(responseArray[0].created_at);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: `New Candidate with ID: ${item.id}`,
          ts: item.created_at,
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
  sampleEmit,
};
