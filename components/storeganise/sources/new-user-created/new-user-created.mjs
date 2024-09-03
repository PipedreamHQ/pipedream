import common from "../common/base.mjs";

export default {
  ...common,
  key: "storeganise-new-user-created",
  name: "New User Created",
  description: "Emit new event when a new user is created in Storeganise",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.storeganise.listUsers;
    },
    generateMeta(user) {
      return {
        id: user.id,
        summary: `New User Created: ${user.id}`,
        ts: Date.now(),
      };
    },
  },
};
