import pocket from "../../pocket.app.mjs";
import constants from "./constants.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    pocket,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    additionalParams() {
      return {};
    },
    emitEvent(data) {
      throw new Error("emitEvent is not implemented", data);
    },
    _setLastItemId(id) {
      this.db.set("lastItemId", id);
    },
    _getLastItemId() {
      return this.db.get("lastItemId");
    },
  },
  hooks: {
    async deploy() {
      const items = await this.pocket.getSavedItems({
        params: {
          count: 10,
          ...this.additionalParams(),
        },
      });

      items.forEach(this.emitEvent);
    },
  },
  async run() {
    const lastItemId = this._getLastItemId();

    let page = 0;

    while (true) {
      const items = await this.pocket.getSavedItems({
        params: {
          offset: page * constants.LIMIT_PER_PAGE,
          count: constants.LIMIT_PER_PAGE,
          ...this.additionalParams(),
        },
      });

      items.reverse().forEach(this.emitEvent);

      if (items.length) {
        this._setLastItemId(items[0].item_id);
      }

      if (
        items.length < constants.LIMIT_PER_PAGE ||
        items.filter((item) => item.item_id === lastItemId).length
      ) {
        return;
      }

      page++;
    }
  },
};
