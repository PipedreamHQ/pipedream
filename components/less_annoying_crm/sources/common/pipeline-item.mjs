import base from "./base.mjs";

export default {
  ...base,
  methods: {
    ...base.methods,
    async fetchRecords(body) {
      const ids = body.PipelineItems?.map(({ PipelineItemId }) => PipelineItemId) ?? [];
      return Promise.all(ids.map((PipelineItemId) => this.app.getPipelineItem({
        parameters: {
          PipelineItemId,
        },
      })));
    },
    getDedupeId(item) {
      return item.PipelineItemId;
    },
    getAction() {
      throw new Error("getAction is not implemented");
    },
    generateMeta(item) {
      const contactName = item.ContactMetaData?.Name;
      const pipelineName = item.PipelineMetaData?.Name;
      const statusName = item.StatusMetaData?.Name;
      return {
        id: this.getDedupeId(item),
        summary: `${pipelineName} item ${this.getAction()}: ${contactName} (${statusName})`,
        ts: Date.parse(item.LastUpdate ?? item.DateCreated) || Date.now(),
      };
    },
  },
};
