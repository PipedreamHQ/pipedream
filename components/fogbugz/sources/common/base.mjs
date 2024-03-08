import {
  ConfigurationError, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import fogbugz from "../../fogbugz.app.mjs";

export default {
  props: {
    fogbugz,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getInitialValue() {
      return 0;
    },
    _getLastId() {
      return this.db.get("lastId") || this.getInitialValue();
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    getData() {
      throw new ConfigurationError("getData is not implemented");
    },
    getIdField() {
      throw new ConfigurationError("getIdField is not implemented");
    },
    getDataField() {
      throw new ConfigurationError("getDataField is not implemented");
    },
    getSummary() {
      throw new ConfigurationError("getSummary is not implemented");
    },
    async emitCaseEvents(maxResults = false) {
      const lastId = this._getLastId();
      const { data } = await this.fogbugz.post({
        data: {
          ...this.getData(),
          max: 100000,
        },
      });

      const idField = this.getIdField();
      const dataField = this.getDataField();

      const responseArray = data[dataField]
        .filter((item) => item[idField] > lastId)
        .sort((a, b) => b[idField] - a[idField]);

      if (responseArray.length) {
        this._setLastId(responseArray[0][idField]);
      }

      if (maxResults && responseArray.length > maxResults) {
        responseArray.length = maxResults;
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item[idField],
          summary: this.getSummary(item),
          ts: new Date(),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitCaseEvents(25);
    },
  },
  async run() {
    await this.emitCaseEvents();
  },
};
