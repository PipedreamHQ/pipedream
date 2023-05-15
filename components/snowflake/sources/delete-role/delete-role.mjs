import snowflake from "../../snowflake.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { v4 as uuid } from "uuid";

export default {
  type: "source",
  key: "snowflake-new-user",
  name: "New User",
  description: "Emit new event when a user is created",
  version: "0.0.1",
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
    async addValueToObject(key, value) {
      const db = this.db.get("values");
      if (!db) {
        this.db.set("values", {});
      }

      db[key] = value;
      this.db.set("values", db);
    },
    async fetchData() {
      return this.snowflake.getRows({
        sqlText: "show roles",
      });
    },
    async getArrayFromStream(stream) {
      const array = [];
      for await (const item of stream) {
        array.push(item);
      }
      return array;
    },
    async updateRoles() {
      const rows = await this.fetchData();
      const roles = await this.getArrayFromStream(rows);
      for (const role of roles) {
        this.addValueToObject(role.name, role);
      }
      return roles;
    },
    async checkMissingRoles(currentRoles) {
      const db = this.db.get("values");
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

      this.db.set("values", db);
    },
    emit(event) {
      this.$emit(event, {
        summary: event.name,
        id: uuid(),
        ts: Date.now(),
      });
    },
  },
  async run() {
    const roles = await this.updateRoles();
    const roleNames = roles.map((role) => role.name);
    await this.checkMissingRoles(roleNames);
  },
};

