import acedatacloud from "../../acedatacloud.app.mjs";
import { happyhorseInput } from "../../common/video-inputs.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.3",
  key: "acedatacloud-happyhorse-generate-video",
  name: "Generate HappyHorse Video",
  description: "HappyHorse (Happy Horse) video generation through Ace Data Cloud. Submit once and save the task ID; media is pending. [See the documentation](https://platform.acedata.cloud/documents/happyhorse-videos)",
  path: "/happyhorse/videos",
  modelChoices: true,
  props: {
    generationMode: {
      type: "string",
      label: "Generation Mode",
      options: [
        {
          label: "Text to Video",
          value: "generate",
        },
        {
          label: "Image to Video",
          value: "image_to_video",
        },
        {
          label: "Reference to Video",
          value: "reference_to_video",
        },
        {
          label: "Video Edit",
          value: "video_edit",
        },
      ],
      default: "generate",
      optional: true,
    },
    firstFrameUrl: {
      propDefinition: [
        acedatacloud,
        "imageUrl",
      ],
      label: "First Frame URL",
      description: "Required for an i2v model in Image to Video mode. Example: `https://example.com/image.png`.",
      optional: true,
    },
    referenceImageUrls: {
      propDefinition: [
        acedatacloud,
        "imageUrls",
      ],
      label: "Reference Images",
      description: "Use 1–9 images for an r2v model, or up to 5 optional images for video editing. Example: `[\"https://example.com/image.png\"]`.",
      optional: true,
    },
    videoUrl: {
      propDefinition: [
        acedatacloud,
        "videoUrl",
      ],
      label: "Video to Edit",
      description: "Required for the video-edit model. Output duration follows the input; input and output video seconds are billed. Example: `https://example.com/video.mp4`.",
      optional: true,
    },
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
      description: "Video description, e.g. `a horse crossing a meadow`.",
    },
    model: {
      type: "string",
      label: "Model",
      description: "Public Happy Horse model, e.g. `happyhorse-1.0-t2v`.",
      default: "happyhorse-1.0-t2v",
    },
  },
  buildData: happyhorseInput,
});
