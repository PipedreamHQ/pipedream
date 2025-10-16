import common from "../common/generate-content.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  key: "google_gemini-generate-content-from-text",
  name: "Generate Content from Text",
  description: "Generates content from text input using the Google Gemini API. [See the documentation](https://ai.google.dev/tutorials/rest_quickstart#text-only_input)",
  version: "0.2.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  async run({ $ }) {
    const {
      app,
      model,
      text,
      history,
      safetySettings,
      responseFormat,
      responseSchema,
      maxOutputTokens,
      temperature,
      topP,
      topK,
      stopSequences,
    } = this;

    const contents = [
      ...this.formatHistoryToContent(history),
      {
        parts: [
          {
            text,
          },
        ],
        role: "user",
      },
    ];

    const response = await app.generateContent({
      $,
      model,
      data: {
        contents,
        safetySettings: this.formatSafetySettings(safetySettings),
        ...(
          responseFormat || maxOutputTokens || temperature || topP || topK || stopSequences?.length
            ? {
              generationConfig: {
                responseMimeType: "application/json",
                responseSchema: utils.parse(responseSchema),
                maxOutputTokens,
                temperature,
                topP,
                topK,
                stopSequences,
              },
            }
            : {}
        ),
      },
    });

    $.export("$summary", "Successfully generated content from text input.");

    return response;
  },
};
