import bigml from "../../bigml.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import constants from "../../common/constants.mjs";

export default {
  props: {
    bigml,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      this._setLastDate(new Date());

      console.log("Retrieving historical events...");
      const { objects } = await this.listingFunction().call(this, {
        params: {
          limit: constants.HISTORICAL_EVENTS_LIMIT,
        },
      });

      for (const object of objects.reverse()) {
        this.emitEvent(object);
      }
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate");
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate.toISOString().slice(0, -1));
    },
    listingFunction() {
      throw new Error("listingFunction() must be implemented");
    },
    emitEvent() {
      throw new Error("emitEvent() must be implemented");
    },
  },
  async run() {
    let offset = 0;

    while (true) {
      const lastDate = this._getLastDate();
      const currentDate = new Date();

      const { objects } = await this.listingFunction().call(this, {
        paginate: true,
        params: {
          offset,
          limit: constants.MAX_LIMIT,
          created__gte: lastDate,
        },
      });

      this._setLastDate(currentDate);
      offset += objects.length;

      if (objects.length === 0) {
        return;
      }

      for (const object of objects) {
        this.emitEvent(object);
      }
    }
  },
};
