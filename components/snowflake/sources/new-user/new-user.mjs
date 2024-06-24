import common from "../common.mjs";

export default {
  ...common,
  type: "source",
  key: "snowflake-new-user",
  name: "New User",
  description: "Emit new event when a user is created",
  version: "0.1.2",
  methods: {
    ...common.methods,
    alwaysRunInSingleProcessMode() {
      return true;
    },
    generateMeta({
      row,
      timestamp: ts,
    }) {
      return {
        id: row.name,
        summary: row.name,
        ts,
      };
    },
    getStatement() {
      return {
        sqlText: "show users",
      };
    },
  },
};
