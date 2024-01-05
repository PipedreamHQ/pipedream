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
    getResourcesFn() {
      return this.app.listForms;
    },
    getResourcesFnArgs() {
      return;
    },
    generateMeta(resource) {
      const { app } = this;
      const id = app.getValueFromForm(resource);
      const name = app.getValueFromForm(resource, "name");
      return {
        id,
        summary: `New Form: ${name}`,
        ts: Date.now(),
      };
    },
  },
};
