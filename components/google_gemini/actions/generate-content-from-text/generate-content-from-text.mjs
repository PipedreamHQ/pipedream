import app from "../../google_gemini.app.mjs";

export default {
  key: "google_gemini-generate-content-from-text",
  name: "Generate Content from Text",
  description: "Generates content from text input using the Google Gemini API. [See the documentation](https://ai.google.dev/tutorials/rest_quickstart#text-only_input)",
  version: "0.1.0",
  type: "action",
  props: {
    app,
    model: {
      propDefinition: [
        app,
        "model",
      ],
    },
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
      model,
      text,
    } = this;

    const response = await app.generateContent({
      $,
      model,
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
