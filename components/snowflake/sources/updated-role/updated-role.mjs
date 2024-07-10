import common from "../common-update.mjs";

export default {
  ...common,
  type: "source",
  key: "snowflake-updated-role",
  name: "New Update Role",
  description: "Emit new event when a role is updated",
  version: "0.1.2",
  methods: {
    ...common.methods,
    getLookUpKey() {
      return "name";
    },
    getSqlText() {
      return "show roles";
    },
  },
};
