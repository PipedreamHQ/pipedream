import common from "../common/common.mjs";

export default {
  ...common,
  key: "overloop-new-workflow-created",
  name: "New Workflow Created",
  description: "Emit new event each time a workflow is created. [See the docs](https://apidoc.overloop.com/#list-automations)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async emitHistoricalEvents({ limit }) {
      const results = await this.processEvent(this.overloop.listAutomations, {
        sort: "-created_at",
        filter: "automation_type:workflow",
      });
      results.slice(0, limit).forEach((result) => this.emitEvent(result));
    },
    getResultTs(workflow) {
      return Date.parse(workflow.attributes.created_at);
    },
    generateMeta(workflow) {
      return {
        id: workflow.id,
        summary: workflow.attributes.name,
        ts: this.getResultTs(workflow),
      };
    },
  },
  async run() {
    const results = await this.processEvent(this.overloop.listAutomations, {
      sort: "-created_at",
      filter: "automation_type:workflow",
    });
    results.forEach((result) => this.emitEvent(result));
  },
};
