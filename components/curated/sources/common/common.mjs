import curated from "../../curated.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    curated,
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
    async getResources(args = {}) {
      throw new Error("getResources is not implemented", args);
    },
    _setLastResourceId(id) {
      this.db.set("lastResourceId", id);
    },
    _getLastResourceId() {
      return this.db.get("lastResourceId");
    },
  },
  hooks: {
    async deploy() {
      const { resources } = await this.getResources();

      resources.slice(10).forEach(this.emitEvent);
    },
  },
  async run() {
    const lastResourceId = this._getLastResourceId();

    let page = 1;

    while (true) {
      const {
        currentPage, resources,
      } = await this.getResources({
        params: {
          page,
        },
      });

      resources.forEach(this.emitEvent);

      if (resources.length) {
        this._setLastResourceId(resources[0].id);
      }

      if (!currentPage ||
        resources.length < 100 ||
        resources.filter((resource) => resource.id === lastResourceId).length
      ) {
        return;
      }

      page++;
    }
  },
};
