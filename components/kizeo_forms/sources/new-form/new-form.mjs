import common from "../common/polling.mjs";

export default {
  ...common,
  key: "kizeo_forms-new-form",
  name: "New Form Created",
  description: "Emit new event when a new form is created on Kizeo Forms. [See the documentation](https://www.kizeoforms.com/doc/swagger/v3/#/forms/get_forms)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    sortFn(a, b) {
      const dateA = new Date(a.create_time);
      const dateB = new Date(b.create_time);
      return dateA - dateB;
    },
    getResourcesName() {
      return "forms";
    },
    getResourcesFn() {
      return this.app.listForms;
    },
    getResourcesFnArgs() {
      return;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Form: ${resource.name}`,
        ts: Date.parse(resource.create_time),
      };
    },
  },
};
