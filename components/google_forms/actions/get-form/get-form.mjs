import googleForms from "../../google_forms.app.mjs";

export default {
  key: "google_forms-get-form",
  name: "Get Form",
  description: "Get information about a Google Form. [See the documentation](https://developers.google.com/forms/api/reference/rest/v1/forms/get)",
  version: "0.0.2",
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
  },
  async run({ $ }) {
    const response = await this.googleForms.getForm({
      formId: this.formId,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved data for form with ID ${this.formId}`);
    }

    return response;
  },
};
