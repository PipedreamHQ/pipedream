import snowflake from "../snowflake.app.mjs";
import {
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import { v4 as uuid } from "uuid";

export default {
  dedupe: "unique",
  props: {
    snowflake,
    db: "$.service.db",
    timer: {
      description: "Watch for changes on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    getDbValues() {
      return this.db.get("dbValues") ?? {};
    },
    setDbValues(values) {
      return this.db.set("dbValues", values);
    },
    async fetchData() {
      return this.snowflake.executeQuery({
        sqlText: this.getSqlText(),
      });
    },
    async updateDbValues() {
      const db = this.getDbValues();
      const rows = await this.fetchData();
      for await (const item of rows) {
        const key = item[this.getLookUpKey()];
        db[key] = item;
      }
      this.setDbValues(db);
    },
    async checkForDifferentData(db, rows) {
      for await (const item of rows) {
        const currentLookUpKey = item[this.getLookUpKey()];
        const isNewItem = !db[currentLookUpKey];
        if (isNewItem) {
          this.emitNewEvent(item);
        } else {
          const changedKeys = this.getChangedKeys(db[currentLookUpKey], item);
          if (changedKeys.length > 0) {
            this.emitUpdatedEvent(item, db[currentLookUpKey], changedKeys);
          }
        }
      }
    },

    getChangedKeys(dbObject, queryObject) {
      const changedKeys = [];
      for (const key in dbObject) {
        if (queryObject[key] instanceof Date) {
          if (new Date(dbObject[key]).getTime() != queryObject[key].getTime()) {
            changedKeys.push(key);
          }
          continue;
        }
        if (dbObject[key] != queryObject[key]) {
          changedKeys.push(key);
        }
      }
      return changedKeys;
    },
    emit(isNew, newData, oldData, changedKeys) {
      const event = {
        newData,
        oldData,
        changedKeys,
      };

      const createOrUpdatedString = isNew
        ? "created"
        : "updated";
      this.$emit(event, {
        summary: `${newData[this.getLookUpKey()]} was ${createOrUpdatedString}`,
        id: uuid(),
        ts: Date.now(),
      });
    },
    emitNewEvent(newData) {
      this.emit(true, newData);
    },
    emitUpdatedEvent(newData, oldData, changedKeys) {
      this.emit(false, newData, oldData, changedKeys);
    },
    getLookUpKey() {
      throw new ConfigurationError("getLookUpKey must be implemented");
    },
    getSqlText() {
      throw new ConfigurationError("getSqlText must be implemented");
    },
  },
  hooks: {
    async deploy() {
      await this.updateDbValues();
    },
  },
  async run() {
    const db = this.getDbValues();
    const rows = await this.fetchData();
    await this.checkForDifferentData(db, rows);
    await this.updateDbValues();
  },
};
