import supportbee from "../../supportbee.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    supportbee,
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
    getResources(args = {}) {
      throw new Error("getResources is not implemented", args);
    },
    _setLastResourceId(resourceId) {
      this.db.set("lastResourceId", resourceId);
    },
    _getLastResourceId() {
      return this.db.get("lastResourceId");
    },
  },
  hooks: {
    async deploy() {
      const resources = await this.getResources({
        params: {
          per_page: 10,
          sort_by: "creation_time",
        },
      });

      resources.reverse().forEach(this.emitEvent);

      if (resources.length) {
        this._setLastResourceId(resources[0].id);
      }
    },
  },
  async run() {
    const lastResourceId = this._getLastResourceId();

    let page = 1;

    while (true) {
      const resources = await this.getResources({
        params: {
          per_page: 100,
          page,
        },
      });

      resources.reverse().forEach(this.emitEvent);

      if (resources.length) {
        this._setLastResourceId(resources[0].id);
      }

      if (
        resources.length < 100 ||
        resources.find((payment) => payment.id === lastResourceId)
      ) {
        return;
      }

      page++;
    }
  },
};
