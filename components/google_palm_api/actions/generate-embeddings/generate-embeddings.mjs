import palm from "../../google_palm_api.app.mjs";

export default {
  key: "google_palm_api-generate-embeddings",
  name: "Generate Embeddings",
  description: "Generate embeddings using Google PaLM. [See the docs here](https://developers.generativeai.google/api/python/google/generativeai/generate_embeddings)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    palm,
    text: {
      type: "string",
      label: "Text",
      description: "The text that will be used to generate embeddings",
    },
  },
  async run({ $ }) {
    const response = await this.palm.generateEmbeddings(this.text);
    $.export("$summary", "Successfully generated embeddings");
    return response;
  },
};
