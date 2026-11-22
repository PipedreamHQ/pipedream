import acedatacloud from "../../acedatacloud.app.mjs";
import { seedanceInput } from "../../common/video-inputs.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.3",
  key: "acedatacloud-seedance-generate-video",
  name: "Generate Seedance Video",
  description: "Seedance video generation through Ace Data Cloud. Submit once and save the task ID; media is pending. [See the documentation](https://platform.acedata.cloud/documents/seedance-videos)",
  path: "/seedance/videos",
  modelChoices: true,
  props: {
    firstFrameUrl: {
      propDefinition: [
        acedatacloud,
        "imageUrl",
      ],
      label: "First Frame URL",
      description: "Required for the Lite i2v model. Frame inputs cannot be combined with reference media. Example: `https://example.com/image.png`.",
      optional: true,
    },
    lastFrameUrl: {
      propDefinition: [
        acedatacloud,
        "imageUrl",
      ],
      label: "Last Frame URL",
      description: "Optional last frame; requires a first frame and compatible model. Example: `https://example.com/image.png`.",
      optional: true,
    },
    referenceImageUrls: {
      propDefinition: [
        acedatacloud,
        "imageUrls",
      ],
      label: "Reference Images",
      description: "Seedance 2.x multimodal reference images. Example: `[\"https://example.com/image.png\"]`.",
      optional: true,
    },
    referenceVideoUrls: {
      propDefinition: [
        acedatacloud,
        "videoUrls",
      ],
      label: "Reference Videos",
      description: "Up to 3 references for 2.0, or 10 for 2.5. Check the selected model's duration limits. Example: `[\"https://example.com/video.mp4\"]`.",
      optional: true,
    },
    referenceAudioUrls: {
      propDefinition: [
        acedatacloud,
        "audioUrls",
      ],
      label: "Reference Audio",
      description: "Up to 3 references for 2.0 (requires an image or video) or 10 for 2.5 (audio-only references allowed). Example: `[\"https://example.com/audio.mp3\"]`.",
      optional: true,
    },
    resolution: {
      type: "string",
      label: "Resolution",
      description: "Select a resolution supported by the model. Seedance 2.0 Standard supports 4k; Fast/Mini supports 480p/720p; 2.5 supports up to 1080p. Example: `480p`.",
      options: [
        "480p",
        "720p",
        "1080p",
        "4k",
      ],
      default: "480p",
      optional: true,
    },
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
      description: "Video description, e.g. `a calm lake at dawn`.",
    },
    model: {
      type: "string",
      label: "Model",
      description: "Public Seedance model, e.g. `doubao-seedance-2-0-mini-260615`.",
      default: "doubao-seedance-2-0-mini-260615",
    },
  },
  buildData: seedanceInput,
});
