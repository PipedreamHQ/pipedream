import googleForms from "../../google_forms.app.mjs";

export default {
  key: "google_forms-create-text-question",
  name: "Create Text Question",
  description: "Creates a new text question in a Google Form. [See the documentation](https://developers.google.com/forms/api/reference/rest/v1/forms/batchUpdate)",
  version: "0.0.3",
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
      propDefinition: [
        googleForms,
        "questionTitle",
      ],
    },
    description: {
      propDefinition: [
        googleForms,
        "questionDescription",
      ],
    },
    index: {
      propDefinition: [
        googleForms,
        "questionIndex",
      ],
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
