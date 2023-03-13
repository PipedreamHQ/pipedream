import totango from "../../totango.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    totango,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastCreated() {
      return this.db.get("lastCreated");
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    getTerms() {
      return "";
    },
    getTimestampKey() {
      return null;
    },
    emitEvent(data) {
      throw new Error("emitEvent is not implemented", data);
    },
    getResourceMethod() {
      throw new Error("getResourceMethod is not implemented");
    },
  },
  hooks: {
    async deploy() {
      const resources = await this.getResourceMethod()({
        data: {
          "query": `{"terms":[${this.getTerms()}],"count":10,"offset":0,"fields":[],"scope":"all"}`,
        },
      });

      if (!(resources.length > 0)) {
        return;
      }
      this._setLastCreated(resources[0][this.getTimestampKey()]);
      resources.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    let page = 0;
    const lastCreated = this._getLastCreated() || 0;
    let maxLastCreated = lastCreated;

    while (true) {
      const resources = await this.getResourceMethod()({
        data: {
          "query": `{"terms":[${this.getTerms(lastCreated)}],"count":100,"offset":${page * 100},"fields":[],"scope":"all"}`,
        },
      });

      if (!(resources.length > 0)) {
        break;
      }

      const timestampKey = this.getTimestampKey();
      maxLastCreated = timestampKey && resources[0][timestampKey] > lastCreated
        ? resources[0][timestampKey]
        : lastCreated;
      resources.reverse().forEach(this.emitEvent);

      if (resources?.length < 100) {
        break;
      }

      page++;
    }

    this._setLastCreated(maxLastCreated);
  },
};
