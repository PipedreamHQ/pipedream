import common from "../common-delete.mjs";

export default {
  ...common,
  type: "source",
  key: "snowflake-deleted-role",
  name: "New Deleted Role",
  description: "Emit new event when a role is deleted",
  version: "0.1.2",
  methods: {
    ...common.methods,
    getSqlText() {
      return "show roles";
    },
  },
};

