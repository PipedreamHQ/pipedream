import common from "../common/common.mjs";

export default {
  ...common,
  key: "overloop-new-user-created",
  name: "New User Created",
  description: "Emit new event each time a user is created. [See the docs](https://apidoc.overloop.com/#list-users)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents({ limit }) {
      const results = await this.processEvent(this.overloop.listUsers, {
        sort: "-created_at",
      });
      results.slice(0, limit).forEach((result) => this.emitEvent(result));
    },
    getResultTs(user) {
      return Date.parse(user.attributes.created_at);
    },
    generateMeta(user) {
      return {
        id: user.id,
        summary: user.attributes.name,
        ts: this.getResultTs(user),
      };
    },
  },
  async run() {
    const results = await this.processEvent(this.overloop.listUsers, {
      sort: "-created_at",
    });
    results.forEach((result) => this.emitEvent(result));
  },
};
