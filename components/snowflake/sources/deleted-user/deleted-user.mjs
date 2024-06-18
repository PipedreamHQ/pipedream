import common from "../common-delete.mjs";

export default {
  ...common,
  type: "source",
  key: "snowflake-deleted-user",
  name: "New Deleted User",
  description: "Emit new event when a user is deleted",
  version: "0.1.0",
  methods: {
    ...common.methods,
    getSqlText() {
      return "show users";
    },
  },
};

