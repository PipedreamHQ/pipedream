import common from "../common/common.mjs";

export default {
  ...common,
  key: "raisely-new-user-created",
  name: "New User Created",
  description: "Emit new event when a new user has been created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.raisely.listUsers;
    },
    getTsField() {
      return "createdAt";
    },
    generateMeta(user) {
      return {
        id: user.uuid,
        summary: `New User "${user.uuid}"`,
        ts: Date.parse(user[this.getTsField()]),
      };
    },
  },
};
