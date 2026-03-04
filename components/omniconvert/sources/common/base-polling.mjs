import omniconvert from "../../omniconvert.app.mjs";
import {
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL, ConfigurationError,
} from "@pipedream/platform";

export default {
  props: {
    omniconvert,
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
    async processEvents(max) {
      const lastId = this._getLastId();

      const results = await this.omniconvert.listExperiments({
        params: {
          "sort-by": "id",
          "sort-direction": "DESC",
          "filter": {
            "experiment-type": this.getExperimentType(),
          },
        },
      });

      const items = [];
      let count = 0;
      for (const item of results) {
        if (item.id <= lastId) {
          break;
        }
        items.push(item);
        if (max && ++count >= max) {
          break;
        }
      }

      if (!items.length) {
        return;
      }

      this._setLastId(items[0].id);

      items.reverse().forEach((item) => {
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      });
    },
    getExperimentType() {
      throw new ConfigurationError("getExperimentType must be implemented");
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta must be implemented");
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(10);
    },
  },
  async run() {
    await this.processEvents();
  },
};
