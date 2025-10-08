import zohoForms from "../../zoho_forms.app.mjs";

export default {
  key: "zoho_forms-get-form-fields",
  name: "Get Form Fields",
  description: "Get the fields of a particular form",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zohoForms,
    formId: {
      propDefinition: [
        zohoForms,
        "formId",
      ],
    },
  },
  async run({ $ }) {
    const {
      formId,
      zohoForms,
    } = this;

    const response = await zohoForms.getFormFields({
      params: {
        form_id: formId,
      },
    });

    $.export("$summary", `Successfully fetched form with ID: ${formId}.`);
    return response;
  },
};
