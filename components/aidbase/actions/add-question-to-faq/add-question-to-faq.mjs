import aidbase from "../../aidbase.app.mjs";

export default {
  key: "aidbase-add-question-to-faq",
  name: "Add Question to FAQ",
  description: "Add a new question to a FAQ in Airbase. [See the documentation](https://docs.aidbase.ai/apis/knowledge-api/reference/#post-knowledgeidfaq-item)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    aidbase,
    faqId: {
      propDefinition: [
        aidbase,
        "faqId",
      ],
    },
    question: {
      type: "string",
      label: "Question",
      description: "The question of the FAQ item",
    },
    answer: {
      type: "string",
      label: "Answer",
      description: "The answer of the FAQ item",
    },
    sourceUrl: {
      type: "string",
      label: "Source URL",
      description: "The source URL of the FAQ item",
      optional: true,
    },
    categories: {
      type: "string[]",
      label: "Categories",
      description: "A list of category names for the FAQ. If the category does not exist, it will be created.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.aidbase.createFaqItem({
      $,
      faqId: this.faqId,
      data: {
        question: this.question,
        answer: this.answer,
        source_url: this.sourceUrl,
        categories: this.categories,
      },
    });
    $.export("$summary", `Successfully created FAQ item with ID ${response.data.id}`);
    return response;
  },
};
