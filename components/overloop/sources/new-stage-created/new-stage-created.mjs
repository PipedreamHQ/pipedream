import common from "../common/common.mjs";

export default {
  ...common,
  key: "overloop-new-stage-created",
  name: "New Stage Created",
  description: "Emit new event each time a stage is created. [See the docs](https://apidoc.overloop.com/#list-stages)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents({ limit }) {
      const results = await this.processEvent(this.overloop.listStages, {
        sort: "-created_at",
      });
      results.slice(0, limit).forEach((result) => this.emitEvent(result));
    },
    getResultTs(stage) {
      return Date.parse(stage.attributes.created_at);
    },
    generateMeta(stage) {
      return {
        id: stage.id,
        summary: stage.attributes.name,
        ts: this.getResultTs(stage),
      };
    },
  },
  async run() {
    const results = await this.processEvent(this.overloop.listStages, {
      sort: "-created_at",
    });
    results.forEach((result) => this.emitEvent(result));
  },
};
