import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "docugenerate-new-template-created",
  name: "New Template",
  description: "Emit new event when a new template is created. [See the documentation](https://api.docugenerate.com/#/Template/queryTemplates)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.docugenerate.listTemplates;
    },
    generateMeta(template) {
      return {
        id: template.id,
        summary: `New template: ${template.name || template.id}`,
        ts: template.created,
      };
    },
  },
  sampleEmit,
};
