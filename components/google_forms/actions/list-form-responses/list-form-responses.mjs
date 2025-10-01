import googleForms from "../../google_forms.app.mjs";

export default {
  key: "google_forms-list-form-responses",
  name: "List Form Responses",
  description: "List a form's responses. [See the documentation](https://developers.google.com/forms/api/reference/rest/v1/forms.responses/list)",
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

    const { responses } = await this.googleForms.listFormResponses({
      formId: this.formId,
      $,
    });

    if (responses?.length) {
      $.export("$summary", `Successfully retrieved ${responses.length} form response${ responses.length === 1
        ? ""
        : "s"}.`);
    }

    return responses;
  },
};
