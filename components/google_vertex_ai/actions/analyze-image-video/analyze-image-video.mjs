import vertexAi from "../../google_vertex_ai.app.mjs";

export default {
  key: "google_vertex_ai-analyze-image-video",
  name: "Analyze Image/Video",
  description: "Examines an image or video following given instructions. Results will contain the analysis findings. [See the documentation](https://cloud.google.com/vertex-ai/docs/reference/rest/v1/projects.locations.publishers.models/generateContent)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    vertexAi,
    projectId: {
      propDefinition: [
        vertexAi,
        "projectId",
      ],
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "The rules for analysis of the input image/video",
    },
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the file or video to analyze. Only GCS URIs are supported. Please make sure that the path is a valid GCS path. Example: `gs://cloud-samples-data/generative-ai/image/mount_fuji.jpg`",
    },
    mimeType: {
      type: "string",
      label: "Mime Type",
      description: "The mimeType of the image or video to analyze",
      optional: true,
      default: "image/jpeg",
    },
  },
  async run({ $ }) {
    const response = await this.vertexAi.generateContent({
      $,
      projectId: this.projectId,
      model: "gemini-1.0-pro-vision",
      data: {
        contents: [
          {
            role: "user",
            parts: [
              {
                fileData: {
                  mimeType: this.mimeType,
                  fileUri: this.url,
                },
              },
              {
                text: this.instructions,
              },
            ],
          },
        ],
      },
    });
    $.export("$summary", "Successfully analyzed resource");
    return response;
  },
};
