import googleForms from "../../google_forms.app.mjs";

export default {
  key: "google_forms-get-form-response",
  name: "Get Form Response",
  description: "Get a response from a form. [See the documentation](https://developers.google.com/forms/api/reference/rest/v1/forms.responses/get)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleForms,
    formId: {
      propDefinition: [
        googleForms,
        "formId",
      ],
    },
    formResponseId: {
      propDefinition: [
        googleForms,
        "formResponseId",
        (c) => ({
          formId: c.formId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.googleForms.getFormResponse({
      formId: this.formId,
      responseId: this.formResponseId,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved response with ID ${this.formResponseId} for form with ID ${this.formId}`);
    }

    return response;
  },
};
