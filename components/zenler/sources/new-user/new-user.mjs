import common from "../common.mjs";

export default {
  ...common,
  key: "zenler-new-user",
  name: "New User",
  description: "Emit new event when a user is created. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#9417d5e4-9951-0933-f562-593e946b52a6)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.zenler.getUsers;
    },
    getResourceFnArgs() {
      return {
        orderby: "created_at",
        order: "desc",
      };
    },
    resourceFilter(resource) {
      const lastCreatedAt = this.getLastCreatedAt() || 0;
      return Date.parse(resource.created_at) > lastCreatedAt;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `User ID ${resource.id}`,
      };
    },
  },
};
