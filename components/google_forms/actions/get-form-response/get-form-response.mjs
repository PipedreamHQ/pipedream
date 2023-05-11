import googleForms from "../../google_forms.app.mjs";

export default {
  key: "google_forms-get-form-response",
  name: "Get Form Response",
  description: "Get a response from a form. [See the documentation](https://developers.google.com/forms/api/reference/rest/v1/forms.responses/get)",
  version: "0.0.1",
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
