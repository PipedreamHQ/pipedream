import common from "../common.mjs";
import { v4 as uuidv4 } from "uuid";

export default {
  ...common,
  type: "source",
  key: "snowflake-new-table",
  name: "New Table",
  description: "Emit new event when a table is created",
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
    generateMeta({
      row,
      timestamp: ts,
    }) {
      return {
        id: uuidv4(),
        summary: `${row.TABLE_SCHEMA}.${row.TABLE_NAME}`,
        ts,
      };
    },
    getStatement() {
      const lastExecutionTime = this.getLastExecutionTime();
      if (lastExecutionTime) {
        return {
          sqlText: "select * from INFORMATION_SCHEMA.TABLES where CREATED > ? order by CREATED ASC",
          binds: [
            new Date(lastExecutionTime),
          ],
        };
      }
      return {
        sqlText: "select * from INFORMATION_SCHEMA.TABLES order by CREATED ASC",
      };
    },
    additionalProccessing() {
      this.updateLastExecutionTime();
    },
  },
};
