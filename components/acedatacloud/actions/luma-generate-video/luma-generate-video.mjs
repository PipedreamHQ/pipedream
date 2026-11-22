import acedatacloud from "../../acedatacloud.app.mjs";
import {
  requiredHttpUrl, requiredText,
} from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  version: "0.0.1",
  acedatacloud,
  key: "acedatacloud-luma-generate-video",
  name: "Generate Luma Video",
  description: "Generate a Luma video through Ace Data Cloud with optional first and last frames. [See the documentation](https://platform.acedata.cloud/documents/luma-videos)",
  path: "/luma/videos",
  props: {
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
      description: "Describe the video or motion. Example: `A calm lake at sunrise`.",
    },
    firstFrameUrl: {
      propDefinition: [
        acedatacloud,
        "imageUrl",
      ],
      label: "First Frame URL",
      description: "Optional public starting-frame image URL. Example: `https://example.com/image.png`.",
      optional: true,
    },
    lastFrameUrl: {
      propDefinition: [
        acedatacloud,
        "imageUrl",
      ],
      label: "Last Frame URL",
      description: "Optional public ending-frame image URL. Example: `https://example.com/image.png`.",
      optional: true,
    },
    aspectRatio: {
      type: "string",
      label: "Aspect Ratio",
      description: "Optional output ratio, e.g. 16:9.",
      optional: true,
    },
    loop: {
      type: "boolean",
      label: "Loop Video",
      description: "Request a looping video. Example: `false`.",
      optional: true,
    },
    enhancePrompt: {
      type: "boolean",
      label: "Enhance Prompt",
      description: "Allow the service to enhance the prompt. Omit to keep the API default. Example: `false`.",
      optional: true,
    },
  },
  buildData: (step) => ({
    action: "generate",
    prompt: requiredText(step.prompt, "Prompt"),
    ...(step.firstFrameUrl && {
      start_image_url: requiredHttpUrl(step.firstFrameUrl, "First Frame URL"),
    }),
    ...(step.lastFrameUrl && {
      end_image_url: requiredHttpUrl(step.lastFrameUrl, "Last Frame URL"),
    }),
    ...(step.aspectRatio && {
      aspect_ratio: requiredText(step.aspectRatio, "Aspect Ratio"),
    }),
    ...(step.loop !== undefined && {
      loop: step.loop,
    }),
    ...(step.enhancePrompt !== undefined && {
      enhancement: step.enhancePrompt,
    }),
  }),
});
