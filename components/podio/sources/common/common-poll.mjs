import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../podio.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  props: {
    app,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  methods: {
    getResourceFn() {
      throw new Error("getResourceFn() is not implemented!");
    },
    getResourceFnArgs() {
      throw new Error("getResourceFnArgs() is not implemented!");
    },
    doesResourceFnHavePaging() {
      throw new Error("doesResourceFnHavePaging() is not implemented!");
    },
    getSummary() {
      throw new Error("getSummary() is not implemented!");
    },
    getItemId() {
      throw new Error("getItemId() is not implemented!");
    },
    _getLastID() {
      return this.db.get("lastId") || 0;
    },
    _setLastID(lastId) {
      this.db.set("lastId", parseInt(lastId));
    },
  },
  async run() {
    let newLastId = this._getLastID();
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.getResourceFn(),
      resourceFnArgs: this.getResourceFnArgs(),
      resourceFnHasPaging: this.doesResourceFnHavePaging(),
    });
    for await (const item of resourcesStream) {
      if (this.getItemId(item) > this._getLastID()) {
        this.$emit(
          item,
          {
            id: this.getItemId(item),
            summary: this.getSummary(item),
            ts: new Date(),
          },
        );
      }
      if (newLastId < this.getItemId(item)) {
        newLastId = this.getItemId(item);
      }
    }
    this._setLastID(newLastId);
  },
};
