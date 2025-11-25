import frontapp from "../../frontapp.app.mjs";

export default {
  key: "frontapp-get-knowledge-base",
  name: "Get Knowledge Base",
  description: "Fetches a knowledge base. [See the documentation](https://dev.frontapp.com/reference/get-a-knowledge-base)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    frontapp,
    knowledgeBaseId: {
      propDefinition: [
        frontapp,
        "knowledgeBaseId",
      ],
    },
  },
  async run({ $ }) {
    const knowledgeBase = await this.frontapp.getKnowledgeBase({
      $,
      knowledgeBaseId: this.knowledgeBaseId,
    });

    $.export("$summary", `Successfully retrieved knowledge base with ID: ${this.knowledgeBaseId}`);

    return knowledgeBase;
  },
};
