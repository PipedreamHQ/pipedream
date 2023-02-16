import gumroad from "../../gumroad.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    gumroad,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(data) {
      throw new Error("emitEvent is not implemented", data);
    },
    getResources() {
      throw new Error("getResources is not implemented");
    },
    getResourcesKey() {
      throw new Error("getResourcesKey is not implemented");
    },
    _setLastTimestamp() {
      this.db.set("lastTimestamp", new Date().toISOString()
        .slice(0, 10));
    },
    _getLastTimestamp() {
      return this.db.get("lastTimestamp");
    },
  },
  hooks: {
    async deploy() {
      this._setLastTimestamp();

      const response = await this.getResources();
      const resources = response[this.getResourcesKey()];

      resources.slice(-10).reverse()
        .forEach(this.emitEvent);
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    this._setLastTimestamp();

    let page = 0;

    while (true) {
      const response = await this.getResources({
        params: {
          page,
          after: lastTimestamp,
        },
      });
      const resources = response[this.getResourcesKey()];

      resources.reverse().forEach(this.emitEvent);

      if (!resources?.next_page_url) {
        return;
      }

      page++;
    }
  },
};
