import app from "../../google_gemini.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "google_gemini-generate-content-from-text",
  name: "Generate Content from Text",
  description: "Generates content from text input using the Google Gemini API. [See the documentation](https://ai.google.dev/tutorials/rest_quickstart#text-only_input)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      text,
    } = this;

    const response = await app.generateContent({
      $,
      modelType: constants.MODEL_TYPE.GEMINI_PRO,
      data: {
        contents: [
          {
            parts: [
              {
                text,
              },
            ],
          },
        ],
      },
    });

    $.export("$summary", "Successfully generated content from text input.");

    return response;
  },
};
