import snowflake from "../snowflake.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { v4 as uuid } from "uuid";

export default {
  type: "source",
  props: {
    snowflake,
    db: "$.service.db",
    timer: {
      description: "Monitor for changes on this schedule.",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async getDbValues() {
      return this.db.get("dbValues") ?? {};
    },
    async setDbValues(values) {
      return this.db.set("dbValues", values);
    },
    getSqlText() {
      throw new Error("getSqlText() not implemented");
    },
    lookUpKey() {
      return "name";
    },
    emit(event) {
      this.$emit(event, {
        summary: event.name,
        id: uuid(),
        ts: Date.now(),
      });
    },
    async getArrayFromStream(stream) {
      const array = [];
      for await (const item of stream) {
        array.push(item);
      }
      return array;
    },
    async fetchData() {
      return this.snowflake.executeQuery({
        sqlText: this.getSqlText(),
      });
    },
    async updateData() {
      const db = await this.getDbValues();
      const rows = await this.fetchData();
      const data = await this.getArrayFromStream(rows);

      for (const item of data) {
        db[item[this.lookUpKey()]] = item;
      }
      await this.setDbValues(db);
      return data;
    },
    async checkMissingData(currentData) {
      const db = await this.getDbValues();
      const dbKeys = Object.keys(db);

      const missingKeys = dbKeys.filter((key) => {
        return !currentData.includes(key);
      });

      for (const key of missingKeys) {
        this.emit(db[key]);
        delete db[key];
      }

      await this.setDbValues(db);
    },
  },
  async run() {
    const data = await this.updateData();
    const dataKeysToCheck = data.map((item) => item[this.lookUpKey()]);
    await this.checkMissingData(dataKeysToCheck);
  },
};

