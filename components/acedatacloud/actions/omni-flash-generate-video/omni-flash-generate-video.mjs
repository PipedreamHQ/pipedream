import acedatacloud from "../../acedatacloud.app.mjs";
import {
  requiredText, requiredHttpUrl,
} from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  key: "acedatacloud-omni-flash-generate-video",
  name: "Generate Omni Flash Video",
  description: "Generate or edit Omni Flash video with optional image and video references through Ace Data Cloud. [See the documentation](https://platform.acedata.cloud/documents/gemini-videos)",
  path: "/gemini/videos",
  modelChoices: true,
  props: {
    "model": {
      "type": "string",
      "label": "Model",
      "description": "Published model from the current Omni Flash API. Example: `omni-flash`.",
      "default": "omni-flash",
    },
    "prompt": {
      "propDefinition": [
        acedatacloud,
        "prompt",
      ],
      "label": "Prompt",
      "description": "Describe the video or the edit. Example: `A calm lake at sunrise`.",
    },
    "imageUrls": {
      "propDefinition": [
        acedatacloud,
        "imageUrls",
      ],
      "label": "Reference Image URLs",
      "description": "Public reference images. At least one is required with a reference video. Example: `[\"https://example.com/image.png\"]`.",
      "optional": true,
    },
    "videoUrl": {
      "propDefinition": [
        acedatacloud,
        "videoUrl",
      ],
      "label": "Reference Video URL",
      "description": "One public reference video for editing; requires Reference Image URLs. Example: `https://example.com/video.mp4`.",
      "optional": true,
    },
    "resolution": {
      "type": "string",
      "label": "Resolution",
      "description": "Output resolution. Example: `720p`.",
      "options": [
        "720p",
        "1080p",
      ],
      "default": "720p",
    },
    "aspectRatio": {
      "type": "string",
      "label": "Aspect Ratio",
      "description": "Output aspect ratio. Example: `9:16`.",
      "options": [
        "16:9",
        "9:16",
      ],
      "default": "16:9",
    },
  },
  buildData: (step) => {
    const images = step.imageUrls?.map((url) => requiredHttpUrl(url, "Reference Image URL")) || [];
    if (step.videoUrl && !images.length) throw new Error("A reference video requires at least one reference image.");
    if (![
      "720p",
      "1080p",
    ].includes(step.resolution)) throw new Error("Choose a published resolution.");
    if (![
      "16:9",
      "9:16",
    ].includes(step.aspectRatio)) throw new Error("Choose a published aspect ratio.");
    return {
      model: requiredText(step.model, "Model"),
      prompt: requiredText(step.prompt, "Prompt"),
      resolution: step.resolution,
      aspect_ratio: step.aspectRatio,
      ...(images.length && {
        image_urls: images,
      }),
      ...(step.videoUrl && {
        video_urls: [
          requiredHttpUrl(step.videoUrl, "Reference Video URL"),
        ],
      }),
    };
  },
});
