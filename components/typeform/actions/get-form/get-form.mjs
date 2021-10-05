import common from "../common.mjs";

export default {
  ...common,
  key: "typeform-get-form",
  name: "Get a Form",
  description: "Select a specific form to get the data. [See the docs here](https://developer.typeform.com/create/reference/retrieve-form/)",
  type: "action",
  version: "0.0.1",
  async run({ $ }) {
    return await this.typeform.getForm({
      $,
      formId: this.formId,
    });
  },
};
