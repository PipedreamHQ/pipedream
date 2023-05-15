import snowflake from "../snowflake.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { v4 as uuid } from "uuid";

export default {
  type: "source",
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
    async getDbValues() {
      return this.db.get("dbValues") ?? {};
    },
    async setDbValues(values) {
      return this.db.set("dbValues", values);
    },
    getSqlText() {
      throw new Error("getSqlText() not implemented");
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
      return this.snowflake.getRows({
        sqlText: this.getSqlText(),
      });
    },
    async updateRoles() {
      const db = await this.getDbValues();
      const rows = await this.fetchData();
      const roles = await this.getArrayFromStream(rows);
      for (const role of roles) {
        db[role.name] = role;
      }
      await this.setDbValues(db);
      return roles;
    },
    async checkMissingRoles(currentRoles) {
      const db = await this.getDbValues();
      const dbKeys = Object.keys(db);

      // Check keys in dbKeys that are not in currentRowsStream
      const missingKeys = dbKeys.filter((key) => {
        return !currentRoles.includes(key);
      });

      // Delete missing keys from db
      for (const key of missingKeys) {
        this.emit(db[key]);
        delete db[key];
      }

      await this.setDbValues(db);
    },
  },
  async run() {
    const roles = await this.updateRoles();
    const roleNames = roles.map((role) => role.name);
    await this.checkMissingRoles(roleNames);
  },
};

