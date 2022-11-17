import sendowl from "../../sendowl.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    sendowl,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(event) {
      throw new Error("emitEvent is not implemented", event);
    },
    getResources(args = {}) {
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
      const resources = await this.getResources({
        params: {
          page: 1,
          per_page: 10,
          sort: "newest_first",
        },
      });

      if (resources.length) {
        this._setLastResourceId(resources[0].id);
      }

      resources.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    const lastResourceId = this._getLastResourceId();

    let page = 1;

    while (true) {
      const resources = await this.getResources({
        params: {
          page,
          per_page: 50,
          sort: "newest_first",
        },
      });

      if (resources.length) {
        this._setLastResourceId(resources[0].id);
      }

      resources.reverse().forEach(this.emitEvent);

      if (
        resources.length < 50 ||
        resources.filter((resource) => resource.id === lastResourceId).length
      ) {
        return;
      }

      page++;
    }
  },
};
