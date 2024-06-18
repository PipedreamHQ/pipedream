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
    chatbotId: {
      propDefinition: [
        app,
        "chatbotId",
      ],
      optional: true,
    },
    alert: {
      type: "alert",
      alertType: "info",
      content: "Bot ID is required if you don't specify Bot ID on the connection popup",
    },
  },
  async run({ $ }) {
    const response = await this.app.semanticSearch({
      $,
      question: this.question,
      chatbotId: this.chatbotId,
    });

    $.export("$summary", `Successfully generated '${response.length}' answers`);

    return response;
  },
};
