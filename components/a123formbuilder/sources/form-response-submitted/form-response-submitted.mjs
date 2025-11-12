import base from "../common/base.mjs";

export default {
  ...base,
  key: "a123formbuilder-form-response-submitted",
  name: "Form Response Submitted",
  description: "Emit new event for every submitted form response",
  type: "source",
  version: "0.0.3",
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
    listingFn() {
      return this.a123formbuilder.getFormResponses;
    },
    listingFnParams() {
      return {
        form: this.form,
      };
    },
  },
};
