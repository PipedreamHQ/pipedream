import app from "../../taodock.app.mjs";
import {
  extractTaskError,
  extractTaskId,
  extractTaskStatus,
  isFailedVideoStatus,
  isTerminalVideoStatus,
  sleep,
} from "../../common/payloads.mjs";

export default {
  key: "taodock-create-video",
  name: "Create Video",
  description:
    "Start a Taodock video generation task from a text prompt. Optionally wait for completion. [See the documentation](https://docs.taodock.com)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  ai: "optimized",
  type: "action",
  props: {
    app,
    model: {
      propDefinition: [
        app,
        "model",
      ],
      description: "The Taodock video model to use (must be video-capable).",
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Describe the video you want to generate.",
    },
    duration: {
      type: "integer",
      label: "Duration (seconds)",
      description: "Requested video length in seconds. Leave empty to use the model default.",
      min: 1,
      optional: true,
    },
    resolution: {
      type: "string",
      label: "Resolution",
      description: "Optional resolution, e.g. `1080p`.",
      optional: true,
    },
    aspectRatio: {
      type: "string",
      label: "Aspect Ratio",
      description: "Optional aspect ratio, e.g. `16:9`.",
      optional: true,
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Optional generation mode supported by the model.",
      optional: true,
    },
    imageUrl: {
      type: "string",
      label: "First Frame URL",
      description: "Optional URL of an image to use as the first frame.",
      optional: true,
    },
    lastFrameUrl: {
      type: "string",
      label: "Last Frame URL",
      description: "Optional URL of an image to use as the last frame.",
      optional: true,
    },
    inputVideoUrl: {
      type: "string",
      label: "Input Video URL",
      description: "Optional URL of an input video to extend or transform.",
      optional: true,
    },
    negativePrompt: {
      type: "string",
      label: "Negative Prompt",
      description: "Optional description of what to avoid in the video.",
      optional: true,
    },
    audio: {
      type: "boolean",
      label: "Generate Audio",
      description: "Whether the video should include generated audio.",
      optional: true,
    },
    seed: {
      type: "integer",
      label: "Seed",
      description: "Optional random seed for reproducible results.",
      optional: true,
    },
    waitForCompletionSeconds: {
      type: "integer",
      label: "Wait for Completion (seconds)",
      description:
        "Maximum seconds to wait for the task to finish. Zero (default) returns the task immediately. Use Get Video Status and Download Video for longer generations.",
      min: 0,
      max: 1800,
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const settings = {
      duration: this.duration,
      resolution: this.resolution,
      aspectRatio: this.aspectRatio,
      mode: this.mode,
      imageUrl: this.imageUrl,
      lastFrameUrl: this.lastFrameUrl,
      inputVideoUrl: this.inputVideoUrl,
      negativePrompt: this.negativePrompt,
      audio: this.audio,
      seed: this.seed,
    };
    let task = await this.app.createVideoTask({
      $,
      model: this.model,
      prompt: this.prompt,
      settings,
    });

    const taskId = extractTaskId(task);
    if (!taskId) {
      throw new Error("The Taodock video task response did not include an ID.");
    }

    const waitSeconds = Number(this.waitForCompletionSeconds ?? 0);
    if (waitSeconds > 0) {
      const deadline = Date.now() + waitSeconds * 1000;
      let status = extractTaskStatus(task);
      while (!isTerminalVideoStatus(status) && Date.now() < deadline) {
        await sleep(this.app._pollIntervalMs());
        task = await this.app.getVideoTask({
          $,
          taskId,
        });
        status = extractTaskStatus(task);
      }

      if (isFailedVideoStatus(status)) {
        throw new Error(extractTaskError(task) ?? "Taodock video generation failed.");
      }
    }

    const status = extractTaskStatus(task);
    $.export(
      "$summary",
      status === "completed" || status === "succeeded"
        ? `Video task \`${taskId}\` completed`
        : `Video task \`${taskId}\` created (status: ${status})`,
    );
    return {
      ...(task && typeof task === "object"
        ? task
        : {}),
      task_id: taskId,
      status,
    };
  },
};
