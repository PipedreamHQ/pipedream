import { getFileStreamAndMetadata } from "@pipedream/platform";
import common from "../common/generate-video.mjs";

export default {
  ...common,
  key: "google_vertex_ai-generate-video-from-image",
  name: "Generate Video from Image",
  description: "Generate a video from an image with optional text prompt using Google Vertex AI Veo models. [See the documentation](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/veo-video-generation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    image: {
      type: "string",
      label: "Image Path Or URL",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/image.jpg`). Supported formats: JPEG, PNG. For best quality, use 720p or higher (1280 x 720 pixels) with 16:9 or 9:16 aspect ratio.",
    },
  },
  async run({ $ }) {
    const {
      projectId,
      model,
      image,
      prompt,
      aspectRatio,
      durationSeconds,
      enhancePrompt,
      generateAudio,
      negativePrompt,
      personGeneration,
      resolution,
      sampleCount,
      storageUri,
    } = this;

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(image);
    const imageBase64 = await this.streamToBase64(stream);

    const operationResponse = await this.app.generateVideosLongRunning({
      $,
      projectId,
      model,
      data: {
        instances: [
          {
            prompt,
            image: {
              bytesBase64Encoded: imageBase64,
              mimeType: metadata.contentType,
            },
          },
        ],
        parameters: {
          aspectRatio,
          durationSeconds,
          enhancePrompt,
          sampleCount,
          negativePrompt,
          personGeneration,
          generateAudio,
          resolution,
          storageUri,
        },
      },
    });

    if (!operationResponse.name) {
      throw new Error("Failed to start video generation operation");
    }

    // Poll the operation until completion
    const completedOperation = await this.pollOperation({
      $,
      projectId,
      model,
      operationName: operationResponse.name,
    });

    if (completedOperation.error) {
      throw new Error(`Video generation failed: ${JSON.stringify(completedOperation.error)}`);
    }

    if (!completedOperation.response) {
      throw new Error("No response received from completed operation");
    }

    const videoCount = completedOperation.response?.videos?.length || 0;

    $.export("$summary", `Successfully generated ${videoCount} video(s) from image`);

    return completedOperation;
  },
};
