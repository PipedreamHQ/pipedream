import coherePlatform from "../../cohere_platform.app.mjs";

export default {
  key: "cohere_platform-summarize-text",
  name: "Summarize Text",
  version: "0.0.1",
  description: "This action generates a summary in English for the given text. [See the docs here](https://docs.cohere.com/reference/summarize-2)",
  type: "action",
  props: {
    coherePlatform,
    text: {
      type: "string",
      label: "Text",
      description: "The text to generate a summary for. Can be up to 100,000 characters long. Currently the only supported language is English.",
    },
    temperature: {
      propDefinition: [
        coherePlatform,
        "temperature",
      ],
    },
    length: {
      propDefinition: [
        coherePlatform,
        "summaryLength",
      ],
    },
    format: {
      propDefinition: [
        coherePlatform,
        "summaryFormat",
      ],
    },
    model: {
      propDefinition: [
        coherePlatform,
        "summaryModel",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.coherePlatform.summarizeText({
      text: this.text,
      temperature: this.temperature && parseFloat(this.temperature),
      length: this.length,
      format: this.format,
      model: this.model,
    });

    if (response.statusCode != "200") {
      throw new Error(response.body.message);
    }

    $.export("$summary", "The text was successfully summarized.");
    return response;
  },
};
