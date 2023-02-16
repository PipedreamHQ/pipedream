import app from "../../noticeable.app.mjs";
import utils from "../../common/utils.mjs";
import * as queries from "../../common/queries.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

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
    setExistingIds(existingIds) {
      this.db.set("existingIds", existingIds);
    },
    getExistingIds() {
      return this.db.get("existingIds") || [];
    },
    setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    getLastCreated() {
      return this.db.get("lastCreated") || 0;
    },
    setLastUpdated(lastUpdated) {
      this.db.set("lastUpdated", lastUpdated);
    },
    getLastUpdated() {
      return this.db.get("lastUpdated") || 0;
    },
    getConfig() {
      throw new Error("getConfig() is not implemented!");
    },
    getSummary() {
      throw new Error("getSummary() is not implemented!");
    },
  },
  async run() {
    const config = this.getConfig();
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.sendQuery,
      queryFn: queries[config.queryFnName],
      queryArgs: config.queryArgs,
      resourceName: config.resourceKey,
      cursorKey: config.cursorKey,
      resourceKey: config.resourceKey,
    });
    if (config.compare == "delete") {
      const idKey = config.idKey || "id";
      const oldExistingIds = this.getExistingIds();
      const newExitstingIds = [];
      for await (const item of resourcesStream) {
        const innerItem = config.itemKey.split(".").reduce((acc, curr) => acc?.[curr], item);
        if (oldExistingIds.includes(innerItem[idKey])) {
          oldExistingIds.splice(oldExistingIds.indexOf(innerItem[idKey]), 1);
        }
        newExitstingIds.push(innerItem[idKey]);
      }
      for (const deletedId of oldExistingIds) {
        this.$emit(
          {
            id: deletedId, //we only have id
          },
          {
            id: Date.now() + Math.ceil( Math.random() * 1000000000 ), //item id is not a number
            ts: Date.now(), //no info about item deletion time
            summary: this.getSummary({
              id: deletedId,
            }),
          },
        );
      }
      this.setExistingIds(newExitstingIds);
    } else {
      let latest, dateKey, newDate = 0;
      if (config.compare == "update") {
        latest = this.getLastUpdated();
        dateKey = "updatedAt";
      } else if (config.compare == "create") {
        latest = this.getLastCreated();
        dateKey = "createdAt";
      }
      for await (const item of resourcesStream) {
        const innerItem = config.itemKey.split(".").reduce((acc, curr) => acc?.[curr], item);
        const itemDate = new Date(innerItem[dateKey]).getTime();
        if (latest < itemDate) {
          this.$emit(
            innerItem,
            {
              id: Date.now() + Math.ceil( Math.random() * 1000000000 ), //item id is not a number
              ts: itemDate,
              summary: this.getSummary(innerItem),
            },
          );
        }
        if (newDate < itemDate) {
          newDate = itemDate;
        }
      }
      if (config.compare == "update") {
        this.setLastUpdated(newDate);
      } else if (config.compare == "create") {
        this.setLastCreated(newDate);
      }
    }
  },
};
