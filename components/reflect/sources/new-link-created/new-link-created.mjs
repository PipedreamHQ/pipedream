import common from "../common/common.mjs";

export default {
  ...common,
  key: "reflect-new-link-created",
  name: "New Link Created",
  description: "Emit new event when a new link is created. [See the documentation](https://openpm.ai/apis/reflect#/graphs/{graphId}/links)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getEvents() {
      return this.reflect.listLinks({
        graphId: this.graphId,
      });
    },
    generateMeta(link) {
      return {
        id: link.id,
        summary: link.title,
        ts: Date.parse(link.updated_at),
      };
    },
  },
};
