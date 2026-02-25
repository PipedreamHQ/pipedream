import frontapp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-list-knowledge-base-categories",
  name: "List Knowledge Base Categories",
  description: "List categories in a knowledge base. [See the documentation](https://dev.frontapp.com/reference/list-categories-in-a-knowledge-base)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    frontapp,
    knowledgeBaseId: {
      propDefinition: [
        frontapp,
        "knowledgeBaseId",
      ],
    },
    maxResults: {
      propDefinition: [
        frontapp,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const categories = [];

    for await (const category of this.frontapp.paginate({
      fn: this.frontapp.listKnowledgeBaseCategories,
      args: {
        knowledgeBaseId: this.knowledgeBaseId,
      },
      maxResults: this.maxResults,
    })) {
      categories.push(category);
    }

    $.export("$summary", `Successfully retrieved ${categories.length} categories from knowledge base ${this.knowledgeBaseId}`);

    return categories;
  },
};
