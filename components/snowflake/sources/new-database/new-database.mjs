import common from "../common.mjs";
import { v4 as uuidv4 } from "uuid";

export default {
  ...common,
  type: "source",
  key: "snowflake-new-database",
  name: "New Database",
  description: "Emit new event when a database is created",
  version: "0.1.2",
  methods: {
    ...common.methods,
    alwaysRunInSingleProcessMode() {
      return true;
    },
    updateLastExecutionTime() {
      this.db.set("lastExecutionTime", Date.now());
    },
    getLastExecutionTime() {
      return this.db.get("lastExecutionTime");
    },
    generateMeta(data) {
      return {
        id: uuidv4(),
        summary: data.row.DATABASE_NAME,
        ts: data.timestamp,
      };
    },
    getStatement() {
      const lastExecutionTime = this.getLastExecutionTime();
      if (lastExecutionTime) {
        return {
          sqlText: "select * from INFORMATION_SCHEMA.DATABASES where CREATED > ? order by CREATED ASC",
          binds: [
            new Date(lastExecutionTime),
          ],
        };
      }
      return {
        sqlText: "select * from INFORMATION_SCHEMA.DATABASES order by CREATED ASC",
      };
    },
    additionalProccessing() {
      this.updateLastExecutionTime();
    },
  },
};
