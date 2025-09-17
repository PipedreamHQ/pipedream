import devin from "../../devin.app.mjs";

export default {
  key: "devin-delete-knowledge",
  name: "Delete Knowledge",
  description: "Delete an existing knowledge object. [See the documentation](https://docs.devin.ai/api-reference/knowledge/delete-knowledge)",
  version: "0.0.1",
  type: "action",
  props: {
    devin,
    knowledgeId: {
      propDefinition: [
        devin,
        "knowledgeId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.devin.deleteKnowledge({
      $,
      knowledgeId: this.knowledgeId,
    });

    $.export("$summary", `Successfully deleted knowledge object: ${this.knowledgeId}`);
    return response;
  },
};
