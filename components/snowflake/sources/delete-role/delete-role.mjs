import snowflake from "../../snowflake.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

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
  hooks: {
    async activate() {
      const db = this.db.get("values");
      if (!db) {
        this.db.set("values", {});
      }
    },
  },
  methods: {
    async addValueToObject(key, value) {
      const db = this.db.get("values");
      db[key] = value;
      this.db.set("values", db);
    },
    getMeta() {

    },
  },
  async run() {
    const rowStream = await this.snowflake.getRows({
      sqlText: "show roles",
    });
    const missingRoles = [];
    const db = this.db.get("values");
    for await (const row of rowStream) {
      if (db[row.name]) {
        missingRoles.push(row);
      }
    }
  },
};

