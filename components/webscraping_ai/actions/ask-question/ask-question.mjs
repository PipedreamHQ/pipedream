import webscraping_ai from "../../webscraping_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "webscraping_ai-ask-question",
  name: "Ask Question about Webpage",
  description: "Gets an answer to a question about a given webpage. [See the documentation](https://webscraping.ai/docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    webscraping_ai,
    targetUrl: {
      propDefinition: [
        webscraping_ai,
        "targetUrl",
      ],
    },
    question: {
      propDefinition: [
        webscraping_ai,
        "question",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.webscraping_ai.getAnswerToQuestion();
    $.export("$summary", `Answer: ${response.answer}`);
    return response;
  },
};
