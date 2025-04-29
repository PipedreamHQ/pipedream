import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "zenventory-new-item-created",
  name: "New Item Created",
  description: "Emit new event when a new item is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFieldDate() {
      return "createdDate";
    },
    getSummary(item) {
      return `New Item: ${item.sku}`;
    },
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();

      const response = this.zenventory.paginate({
        fn: this.zenventory.listItems,
        params: {
          orderBy: "id",
          orderDir: "desc",
        },
        dataField: "items",
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        if (item.id <= lastId) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && responseArray.length > maxResults) {
          responseArray.length = maxResults;
        }
        this._setLastId(responseArray[0].id);
      }

      this.emitData(responseArray);
    },
  },
  sampleEmit,
};
