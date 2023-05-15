import base from "../common/base.mjs";

export default {
  ...base,
  key: "a123formbuilder-form-created",
  name: "Form Created",
  description: "Emit new event for every created form",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getMeta(form) {
      return {
        id: form.id,
        summary: `New form: ${form.name}`,
        ts: new Date(),
      };
    },
    listingFn() {
      return this.a123formbuilder.getForms;
    },
    listingFnParams() {
      return {};
    },
  },
};
