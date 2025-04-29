import common from "../common.mjs";

export default {
  ...common,
  key: "the_magic_drip-new-template-created",
  name: "New Template Created",
  description: "Emit new event when a template is created. [See the documentation](https://docs.themagicdrip.com/api-reference/endpoint/get-v1templates)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getItems() {
      const { templates } = await this.app.listTemplates();
      return templates;
    },
    getItemId(item) {
      return item.templateId;
    },
    getItemMetadata(item) {
      return {
        summary: `New Template: ${item.name}`,
        ts: item.createdAt,
      };
    },
  },
};
