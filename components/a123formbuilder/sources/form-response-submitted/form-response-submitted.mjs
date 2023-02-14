import base from "../common/base.mjs";

export default {
  ...base,
  key: "a123formbuilder-form-response-submitted",
  name: "Form Response Submitted",
  description: "Emit new event for every submitted form response",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...base.props,
    form: {
      propDefinition: [
        base.props.a123formbuilder,
        "form",
      ],
    },
  },
  methods: {
    ...base.methods,
    getMeta(formResponse) {
      return {
        id: formResponse.id,
        summary: `New form response with id ${formResponse.id}`,
        ts: new Date(formResponse.date),
      };
    },
  },
  async run() {
    const page = this.getPage();
    const response = await this.a123formbuilder.getFormResponses({
      paginate: true,
      form: this.form,
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
