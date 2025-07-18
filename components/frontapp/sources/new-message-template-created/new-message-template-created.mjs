import common from "../common/polling-ids.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "frontapp-new-message-template-created",
  name: "New Message Template Created",
  description: "Emit new event when a message template is created. [See the documentation](https://dev.frontapp.com/reference/list-message-templates)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(template) {
      return {
        id: template.id,
        summary: `New message template created: ${template.name}`,
        ts: template.created_at * 1000,
      };
    },
    getItemId(template) {
      return template.id;
    },
    async getItems() {
      const response = await this.frontapp.listMessageTemplates({
        params: {
          sort_by: "created_at",
          sort_order: "desc",
        },
      });

      return response._results || [];
    },
  },
  sampleEmit,
};
