import acedatacloud from "../../acedatacloud.app.mjs";
import { veoInput } from "../../common/video-inputs.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.3",
  key: "acedatacloud-veo-generate-video",
  name: "Generate Veo Video",
  description: "Generate a Veo video and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/veo-videos)",
  path: "/veo/videos",
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
          label: "Image to Video",
          value: "image2video",
        },
        {
          label: "Reference Ingredients",
          value: "ingredients2video",
        },
      ],
      default: "text2video",
      optional: true,
    },
    imageUrls: {
      propDefinition: [
        acedatacloud,
        "imageUrls",
      ],
      label: "Reference Images",
      description: "Use 1–2 first/last frame URLs for Image to Video, or 1–3 reference URLs with veo31-fast-ingredients. Example: `[\"https://example.com/image.png\"]`.",
      optional: true,
    },
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
      description: "Video description, e.g. `a river at sunrise`.",
    },
    model: {
      type: "string",
      label: "Model",
      description: "Public Veo model, e.g. `veo31-fast`.",
      default: "veo31-fast",
    },
  },
  buildData: veoInput,
});
