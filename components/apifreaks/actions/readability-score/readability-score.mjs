import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-readability-score",
  name: "Calculate Readability Score",
  description: "Analyze text readability using industry-standard formulas including Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog Index, SMOG Index, Coleman-Liau Index, and Automated Readability Index. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    target: {
      type: "string",
      label: "Target",
      description: "Target audience used to tune sentence difficulty levels",
      optional: true,
      options: ["general","professional","academic","technical"],
    },
    exclude: {
      type: "string",
      label: "Exclude",
      description: "Comma-separated response sections to omit. Possible values are readability_scores, sentence_readability, readability_grade",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "Text to analyze for readability",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/readability/score",
      params: {
        target: this.target,
        exclude: this.exclude,
      },
      data: {
        text: this.text,
      },
    });
    $.export("$summary", "Successfully executed Calculate Readability Score");
    return response;
  },
};
