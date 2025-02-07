import webscrapingAI from "../../webscraping_ai.app.mjs";

export default {
  key: "webscraping_ai-ask-question",
  name: "Ask Question about Webpage",
  description: "Gets an answer to a question about a given webpage. [See the documentation](https://webscraping.ai/docs#tag/AI/operation/getQuestion)",
  version: "0.0.1",
  type: "action",
  props: {
    webscrapingAI,
    targetUrl: {
      propDefinition: [
        webscrapingAI,
        "targetUrl",
      ],
    },
    question: {
      type: "string",
      label: "Question",
      description: "The question to ask about the given webpage. E.g. `What is the summary of this page content?`",
    },
  },
  async run({ $ }) {
    const response = await this.webscrapingAI.getAnswerToQuestion({
      $,
      params: {
        url: this.targetUrl,
        question: this.question,
      },
    });
    $.export("$summary", "Successfully retrieved answer to question");
    return response;
  },
};
