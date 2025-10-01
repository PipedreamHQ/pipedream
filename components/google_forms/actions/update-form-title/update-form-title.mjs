import googleForms from "../../google_forms.app.mjs";

export default {
  key: "google_forms-update-form-title",
  name: "Update Form Title",
  description: "Updates the title of a Google Form. [See the documentation](https://developers.google.com/forms/api/reference/rest/v1/forms/batchUpdate)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    title: {
      propDefinition: [
        googleForms,
        "title",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.googleForms.updateForm({
      formId: this.formId,
      data: {
        requests: [
          {
            updateFormInfo: {
              info: {
                title: this.title,
              },
              updateMask: "title",
            },
          },
        ],
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully updated form with ID ${this.formId}`);
    }

    return response;
  },
};
