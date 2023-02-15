import base from "../common/base.mjs";

export default {
  ...base,
  key: "a123formbuilder-form-created",
  name: "Form Created",
  description: "Emit new event for every created form",
  type: "source",
  version: "0.0.1",
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
  },
  async run() {
    const page = this.getPage();
    const response = await this.a123formbuilder.getForms({
      paginate: true,
      params: {
        page,
      },
    });
    this.setPage(this.a123formbuilder.getCurrentPage(response));
    response.data.forEach((form) => {
      this.$emit(form, this.getMeta(form));
    });
  },
};
