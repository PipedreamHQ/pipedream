import jigsawstack from "../../jigsawstack.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "jigsawstack-sentiment-analysis",
  name: "Sentiment Analysis",
  description: "Assess sentiment of a provided text. Vibes can be positive, negative, or neutral. [See the documentation](https://docs.jigsawstack.com/api-reference/ai/sentiment)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    jigsawstack,
    text: {
      propDefinition: [
        jigsawstack,
        "text",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.jigsawstack.analyzeSentiment({
      text: this.text,
    });

    $.export("$summary", `Successfully analyzed sentiment with emotion: ${response.sentiment.emotion} and sentiment: ${response.sentiment.sentiment}`);
    return response;
  },
};
