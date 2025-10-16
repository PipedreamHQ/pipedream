import palm from "../../google_palm_api.app.mjs";

export default {
  key: "google_palm_api-generate-text",
  name: "Generate Text",
  description: "Generate text using Google PaLM. [See the docs here](https://developers.generativeai.google/api/python/google/generativeai/generate_text)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    palm,
    promptText: {
      type: "string",
      label: "Prompt Text",
      description: "The text to be used as a prompt for the Google PaLM model",
    },
  },
  async run({ $ }) {
    const response = await this.palm.generateText(this.promptText);
    $.export("$summary", "Successfully generated response");
    return response;
  },
};
