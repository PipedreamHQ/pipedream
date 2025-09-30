import { throwError } from "../../common/utils.mjs";
import jigsawstack from "../../jigsawstack.app.mjs";

export default {
  key: "jigsawstack-sentiment-analysis",
  name: "Sentiment Analysis",
  description: "Assess sentiment of a provided text. Vibes can be positive, negative, or neutral. [See the documentation](https://docs.jigsawstack.com/api-reference/ai/sentiment)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    jigsawstack,
    text: {
      type: "string",
      label: "Text",
      description: "The text to analyze for sentiment.",
    },
  },
  async run({ $ }) {
    try {
      const response = await this.jigsawstack.analyzeSentiment({
        $,
        data: {
          text: this.text,
        },
      });

      $.export("$summary", `Successfully analyzed sentiment with emotion: ${response.sentiment.emotion} and sentiment: ${response.sentiment.sentiment}`);
      return response;
    } catch (e) {
      return throwError(e);
    }
  },
};
