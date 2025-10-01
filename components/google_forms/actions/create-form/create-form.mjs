import googleForms from "../../google_forms.app.mjs";

export default {
  key: "google_forms-create-form",
  name: "Create Form",
  description: "Creates a new Google Form. [See the documentation](https://developers.google.com/forms/api/reference/rest/v1/forms/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleForms,
    title: {
      propDefinition: [
        googleForms,
        "title",
      ],
    },
    documentTitle: {
      type: "string",
      label: "Document Title",
      description: "The title of the document which is visible in Drive",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.googleForms.createForm({
      data: {
        info: {
          title: this.title,
          documentTitle: this.documentTitle,
        },
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created form with ID ${response.id}`);
    }

    return response;
  },
};
