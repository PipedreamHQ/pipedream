import common from "../common/base.mjs";

export default {
  ...common,
  key: "nile_database-new-user-created",
  name: "New User Created",
  description: "Emit new event when a new user is added in a Nile Database",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.nile.listUsers;
    },
    generateMeta(user) {
      return {
        id: user.id,
        summary: `New User ID: ${user.id}`,
        ts: Date.parse(user.created),
      };
    },
  },
};
