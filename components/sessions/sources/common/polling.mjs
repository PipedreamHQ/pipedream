import sessions from "../../sessions.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  dedupe: "unique",
  props: {
    sessions,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(data) {
      throw new Error("emitEvent is not implemented", data);
    },
    _setLastResourceId(id) {
      this.db.set("lastResourceId", id);
    },
    _getLastResourceId() {
      return this.db.get("lastResourceId");
    },
    async getResources(args = {}) {
      throw new Error("getResources is not implemented", args);
    },
    filterResources(resources) {
      return resources;
    },
  },
  async run() {
    const lastResourceId = this._getLastResourceId();

    let page = 0;

    while (page >= 0) {
      let resources = await this.getResources({
        params: {
          page,
        },
      });

      resources = this.filterResources(resources);

      resources.reverse().forEach(this.emitEvent);

      if (resources.filter((payment) => payment.id === lastResourceId)) {
        return;
      }

      page++;
    }
  },
};
