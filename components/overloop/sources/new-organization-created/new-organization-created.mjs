import common from "../common/common.mjs";

export default {
  ...common,
  key: "overloop-new-organization-created",
  name: "New Organization Created",
  description: "Emit new event each time an organization is created. [See the docs](https://apidoc.overloop.com/#list-organizations)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents({ limit }) {
      const results = await this.processEvent(this.overloop.listOrganizations, {
        sort: "-created_at",
      });
      results.slice(0, limit).forEach((result) => this.emitEvent(result));
    },
    getResultTs(org) {
      return Date.parse(org.attributes.created_at);
    },
    generateMeta(org) {
      return {
        id: org.id,
        summary: org.attributes.name,
        ts: this.getResultTs(org),
      };
    },
  },
  async run() {
    const results = await this.processEvent(this.overloop.listOrganizations, {
      sort: "-created_at",
    });
    results.forEach((result) => this.emitEvent(result));
  },
};
