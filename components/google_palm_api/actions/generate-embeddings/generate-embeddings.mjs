import palm from "../../google_palm_api.app.mjs";

export default {
  key: "google_palm_api-generate-embeddings",
  name: "Generate Embeddings",
  description: "Generate embeddings using Google PaLM. [See the docs here]()",
  version: "0.0.1",
  type: "action",
  props: {
    palm,
  },
  async run({ $ }) {
    const response = await this.palm.generateEmbeddings({
      $,
    });
    $.export("$summary", "Successfully generated embeddings");
    return response;
  },
};
