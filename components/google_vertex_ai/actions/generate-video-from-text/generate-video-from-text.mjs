import common from "../common/generate-video.mjs";

export default {
  ...common,
  key: "google_vertex_ai-generate-video-from-text",
  name: "Generate Video from Text",
  description: "Generate a video from a text prompt using Google Vertex AI Veo models. [See the documentation](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/veo-video-generation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  async run({ $ }) {
    const {
      projectId,
      model,
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

    const operationResponse = await this.app.generateVideosLongRunning({
      $,
      projectId,
      model,
      data: {
        instances: [
          {
            prompt,
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

    $.export("$summary", `Successfully generated ${videoCount} video(s)`);

    return completedOperation;
  },
};
