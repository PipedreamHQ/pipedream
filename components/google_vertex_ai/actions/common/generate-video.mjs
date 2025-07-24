import app from "../../google_vertex_ai.app.mjs";

export default {
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    model: {
      propDefinition: [
        app,
        "model",
      ],
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The text prompt to guide video generation. For Veo 3, you can include audio cues like dialogue in quotes, sound effects, and ambient noise descriptions.",
    },
    aspectRatio: {
      type: "string",
      label: "Aspect Ratio",
      description: "The aspect ratio of the generated video",
      options: [
        {
          label: "16:9 (Landscape)",
          value: "16:9",
        },
        {
          label: "9:16 (Portrait) - Veo 2 only",
          value: "9:16",
        },
      ],
      default: "16:9",
    },
    durationSeconds: {
      type: "integer",
      label: "Duration (seconds)",
      description: "The length of the video in seconds. Veo 2: 5-8 seconds, Veo 3: 8 seconds",
      default: 8,
      min: 5,
      max: 8,
    },
    enhancePrompt: {
      type: "boolean",
      label: "Enhance Prompt",
      description: "Use Gemini to enhance your prompts",
      default: true,
    },
    generateAudio: {
      type: "boolean",
      label: "Generate Audio",
      description: "Generate audio for the video (Veo 3 only)",
      default: true,
    },
    negativePrompt: {
      type: "string",
      label: "Negative Prompt",
      description: "A text string that describes anything you want to discourage the model from generating",
      optional: true,
    },
    personGeneration: {
      type: "string",
      label: "Person Generation",
      description: "The safety setting that controls whether people or face generation is allowed",
      options: [
        {
          label: "Allow Adult",
          value: "allow_adult",
        },
        {
          label: "Don't Allow",
          value: "dont_allow",
        },
      ],
      default: "allow_adult",
      optional: true,
    },
    resolution: {
      type: "string",
      label: "Resolution",
      description: "The resolution of the generated video (Veo 3 models only)",
      options: [
        {
          label: "720p",
          value: "720p",
        },
        {
          label: "1080p",
          value: "1080p",
        },
      ],
      default: "720p",
      optional: true,
    },
    sampleCount: {
      type: "integer",
      label: "Sample Count",
      description: "The number of output videos requested",
      default: 1,
      min: 1,
      max: 4,
    },
    storageUri: {
      type: "string",
      label: "Storage URI",
      description: "A Cloud Storage bucket URI to store the output video, in the format `gs://BUCKET_NAME/SUBDIRECTORY`. If a Cloud Storage bucket isn't provided, base64-encoded video bytes are returned in the response.",
      optional: true,
    },
  },
  methods: {
    async pollOperation({
      $, projectId, model, operationName,
    }) {
      const pollInterval = 45000; // 45 seconds
      const maxAttempts = 6;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const response = await this.app.fetchOperation({
            $,
            projectId,
            model,
            data: {
              operationName,
            },
          });

          if (response.done) {
            return response;
          }

          console.log(`Video generation in progress... (attempt ${attempt}/${maxAttempts})`);

          if (attempt < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, pollInterval));
          }
        } catch (error) {
          throw new Error(`Error polling operation: ${error.message}`);
        }
      }

      throw new Error(`Video generation not completed after ${maxAttempts} polling attempts`);
    },
    async streamToBase64(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer.toString("base64"));
        });
        stream.on("error", reject);
      });
    },
  },
};
