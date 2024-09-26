import common from "../common/common.mjs";

export default {
  ...common,
  key: "overloop-new-pipeline-created",
  name: "New Pipeline Created",
  description: "Emit new event each time a list is created. [See the docs](https://apidoc.overloop.com/#list-pipelines)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents({ limit }) {
      const results = await this.processEvent(this.overloop.listPipelines, {}, true);
      results.slice(limit * -1).forEach((result) => this.emitEvent(result));
    },
    getResultTs(pipeline) {
      // using id because no timestamp field included
      return pipeline?.id;
    },
    generateMeta(pipeline) {
      return {
        id: pipeline.id,
        summary: pipeline.attributes.name,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const results = await this.processEvent(this.overloop.listPipelines, {}, true);
    results.forEach((result) => this.emitEvent(result));
  },
};
