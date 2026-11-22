import acedatacloud from "../../acedatacloud.app.mjs";
import { klingInput } from "../../common/video-inputs.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.3",
  key: "acedatacloud-kling-generate-video",
  name: "Generate Kling Video",
  description: "Generate a Kling video and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/kling-videos)",
  path: "/kling/videos",
  modelChoices: true,
  props: {
    generationMode: {
      type: "string",
      label: "Generation Mode",
      options: [
        {
          label: "Text to Video",
          value: "text2video",
        },
        {
          label: "Image / Reference to Video",
          value: "image2video",
        },
      ],
      default: "text2video",
      optional: true,
    },
    qualityMode: {
      type: "string",
      label: "Quality Mode",
      options: [
        "std",
        "pro",
        "4k",
      ],
      default: "std",
      optional: true,
    },
    firstFrameUrl: {
      propDefinition: [
        acedatacloud,
        "imageUrl",
      ],
      label: "First Frame URL",
      description: "Public first-frame image URL for Image to Video. Example: `https://example.com/image.png`.",
      optional: true,
    },
    lastFrameUrl: {
      propDefinition: [
        acedatacloud,
        "imageUrl",
      ],
      label: "Last Frame URL",
      description: "Requires a first frame and a supported model/mode; some legacy models require Pro. Example: `https://example.com/image.png`.",
      optional: true,
    },
    referenceImageUrls: {
      propDefinition: [
        acedatacloud,
        "imageUrls",
      ],
      label: "Omni Reference Images",
      description: "For kling-o1 or kling-v3-omni. Refer to each image in Prompt with <<<image_N>>>. Up to 7 images, or 4 with a video reference. Example: `[\"https://example.com/image.png\"]`.",
      optional: true,
    },
    referenceVideoUrl: {
      propDefinition: [
        acedatacloud,
        "videoUrl",
      ],
      label: "Omni Reference Video",
      description: "For an Omni model. Use <<<video_1>>> in Prompt; reference-video pricing applies. Example: `https://example.com/video.mp4`.",
      optional: true,
    },
    videoReferenceType: {
      type: "string",
      label: "Video Reference Type",
      options: [
        "base",
        "feature",
      ],
      default: "base",
      optional: true,
    },
    keepOriginalSound: {
      type: "boolean",
      label: "Keep Original Sound",
      description: "Keep audio from the reference video. Example: `false`.",
      optional: true,
    },
    generateAudio: {
      type: "boolean",
      label: "Generate Audio",
      description: "Must be off when using a reference video. Example: `false`.",
      optional: true,
    },
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
      description: "Video description, e.g. `a cyclist on a coastal road`.",
    },
    model: {
      type: "string",
      label: "Model",
      description: "Public Kling model, e.g. `kling-v3-turbo`.",
      default: "kling-v3-turbo",
    },
  },
  buildData: klingInput,
});
