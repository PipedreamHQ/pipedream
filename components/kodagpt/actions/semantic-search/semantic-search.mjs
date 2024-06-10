import app from "../../kodagpt.app.mjs";

export default {
  key: "kodagpt-semantic-search",
  name: "Semantic Search",
  description: "Perform a semantic search within chatbot data [See the documentation](https://kodagpt.readme.io/reference/buscas-semanticas)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    question: {
      propDefinition: [
        app,
        "question",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.semanticSearch({
      $,
      question: this.question,
    });

    $.export("$summary", `Successfully generated '${response.length}' answers`);

    return response;
  },
};
