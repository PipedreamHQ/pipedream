import googleForms from "../../google_forms.app.mjs";

export default {
  key: "google_forms-create-text-question",
  name: "Create Text Question",
  description: "Creates a new text question in a Google Form. [See the documentation](https://developers.google.com/forms/api/reference/rest/v1/forms/batchUpdate)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
      type: "string",
      label: "Title",
      description: "Title of the question",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the question",
    },
    index: {
      type: "integer",
      label: "Index",
      description: "The index of an item in the form. This must be in the range [0..N), where N is the number of items in the form.",
    },
    paragraph: {
      type: "boolean",
      label: "Paragraph",
      description: "Whether the question is a paragraph question or not. If not, the question is a short text question.",
    },
  },
  async run({ $ }) {
    const response = await this.googleForms.updateForm({
      formId: this.formId,
      data: {
        requests: [
          {
            createItem: {
              item: {
                title: this.title,
                description: this.description,
                questionItem: {
                  question: {
                    textQuestion: {
                      paragraph: this.paragraph,
                    },
                  },
                },
              },
              location: {
                index: this.index,
              },
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
