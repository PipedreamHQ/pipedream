import acedatacloud from "../../acedatacloud.app.mjs";
import { wanInput } from "../../common/video-inputs.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.3",
  key: "acedatacloud-wan-generate-video",
  name: "Generate Wan Video",
  description: "Generate a Wan video and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/wan-videos)",
  path: "/wan/videos",
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
          label: "Reference to Video",
          value: "reference2video",
        },
      ],
      default: "text2video",
      optional: true,
    },
    firstFrameUrl: {
      propDefinition: [
        acedatacloud,
        "imageUrl",
      ],
      label: "First Frame URL",
      description: "Required for Image to Video; select a matching image model or Wan 3. Example: `https://example.com/image.png`.",
      optional: true,
    },
    lastFrameUrl: {
      propDefinition: [
        acedatacloud,
        "imageUrl",
      ],
      label: "Last Frame URL",
      description: "Wan 3 only; requires a first frame. Example: `https://example.com/image.png`.",
      optional: true,
    },
    referenceImageUrls: {
      propDefinition: [
        acedatacloud,
        "imageUrls",
      ],
      label: "Reference Images",
      description: "Wan 3 reference mode only. Example: `[\"https://example.com/image.png\"]`.",
      optional: true,
    },
    referenceVideoUrls: {
      propDefinition: [
        acedatacloud,
        "videoUrls",
      ],
      label: "Reference Videos",
      description: "For wan2.6-r2v or Wan 3 reference mode. Reference-video input seconds also contribute to usage. Example: `[\"https://example.com/video.mp4\"]`.",
      optional: true,
    },
    referenceAudioUrls: {
      propDefinition: [
        acedatacloud,
        "audioUrls",
      ],
      label: "Reference Audio",
      description: "Wan 3 reference mode only. Wan 3 accepts at most 10 media references in total. Example: `[\"https://example.com/audio.mp3\"]`.",
      optional: true,
    },
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
      description: "Video description, e.g. `clouds crossing a mountain`.",
    },
    model: {
      type: "string",
      label: "Model",
      description: "Public Wan model, e.g. `wan2.6-t2v`.",
      default: "wan2.6-t2v",
    },
  },
  buildData: wanInput,
});
