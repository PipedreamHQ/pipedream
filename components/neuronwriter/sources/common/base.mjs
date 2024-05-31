import {
  ConfigurationError, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import neuronwriter from "../../neuronwriter.app.mjs";

export default {
  props: {
    neuronwriter,
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
      return this.db.get("lastDate") || "1970-01-01";
    },
    _setLastDate(created) {
      this.db.set("lastDate", created);
    },
    generateMeta(item) {
      return {
        id: item.query,
        summary: this.getSummary(item),
        ts: item.updated,
      };
    },
    getFilter() {
      throw new ConfigurationError("getFilter not implemented yet");
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();
      const response = await this.neuronwriter.listQueries({
        data: {
          project: this.neuronwriter.$auth.project_id,
          updated: lastDate,
          ...this.getFilter(),
        },
      });

      const responseArray = [];
      let count = 0;
      for await (const item of response) {
        if (maxResults && (++count > maxResults)) break;
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastDate(responseArray[0].updated);

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
