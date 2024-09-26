import heedjy from "../../heedjy.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "heedjy-new-app-published",
  name: "New App Published",
  description: "Emit new event when a new app is published. [See the documentation](https://heedjy.readme.io/reference/searchapps)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    heedjy,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastUpdated() {
      return this.db.get("lastUpdated");
    },
    _setLastUpdated(lastUpdated) {
      this.db.set("lastUpdated", lastUpdated);
    },
    generateMeta(app) {
      return {
        id: app.id,
        summary: `New app published: ${app.name}`,
        ts: Date.parse(app.first_published_on),
      };
    },
  },
  async run() {
    const lastUpdated = this._getLastUpdated();
    let maxUpdated = lastUpdated;
    const args = {
      params: lastUpdated
        ? {
          updated_from: lastUpdated,
        }
        : {},
    };
    do {
      const {
        items, next,
      } = await this.heedjy.listApps(args);
      for (const item of items) {
        if (!maxUpdated || Date.parse(item.updated_on) > Date.parse(maxUpdated)) {
          maxUpdated = item.updated_on;
        }
        if (item.first_published_on) {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
        }
      }
      args.url = next;
    } while (args.url);
    this._setLastUpdated(maxUpdated);
  },
  sampleEmit,
};
