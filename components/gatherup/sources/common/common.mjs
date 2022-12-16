import gatherup from "../../gatherup.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import dayjs from "dayjs";

export default {
  props: {
    gatherup,
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
      throw Error("emitEvent is not implemented", data);
    },
    async getResources(args = {}) {
      throw Error("getResources is not implemented", args);
    },
    _setLastDateSynced(date) {
      this.db.set("lastDateSynced", date);
    },
    _getLastDateSynced() {
      return this.db.get("lastDateSynced");
    },
  },
  hooks: {
    async deploy() {
      const { resources } = await this.getResources();

      resources.slice(10).reverse()
        .forEach(this.emitEvent);
    },
  },
  async run() {
    const lastDateSynced = this._getLastDateSynced() ?? dayjs().format("YYYY-MM-DD");
    this._setLastDateSynced(dayjs().format("YYYY-MM-DD"));

    let page = 1;

    while (true) {
      const {
        resources, perPage,
      } = await this.getResources({
        params: {
          page,
          from: lastDateSynced,
        },
      });

      resources.reverse().forEach(this.emitEvent);

      if (resources.length) {
        this._setLastDateSynced(resources[0].feedbackId);
      }

      if (
        resources.length < perPage
      ) {
        return;
      }

      page++;
    }
  },
};
