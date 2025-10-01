import typeform from "../../typeform.app.mjs";

export default {
  key: "typeform-get-form",
  name: "Get a Form",
  description: "Select a specific form to get the data. [See the docs here](https://developer.typeform.com/create/reference/retrieve-form/)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    typeform,
    formId: {
      propDefinition: [
        typeform,
        "formId",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.typeform.getForm({
      $,
      formId: this.formId,
    });

    $.export("$summary", `Successfully fetched details for the form, "${resp.title}"`);

    return resp;
  },
};
