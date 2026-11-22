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
      type: "string",
      label: "First Frame URL",
      description: "Required for the Lite i2v model. Frame inputs cannot be combined with reference media.",
      optional: true,
    },
    lastFrameUrl: {
      type: "string",
      label: "Last Frame URL",
      description: "Optional last frame; requires a first frame and compatible model.",
      optional: true,
    },
    referenceImageUrls: {
      type: "string[]",
      label: "Reference Images",
      description: "Seedance 2.x multimodal reference images.",
      optional: true,
    },
    referenceVideoUrls: {
      type: "string[]",
      label: "Reference Videos",
      description: "Up to 3 references for 2.0, or 10 for 2.5. Check the selected model's duration limits.",
      optional: true,
    },
    referenceAudioUrls: {
      type: "string[]",
      label: "Reference Audio",
      description: "Up to 3 references for 2.0 (requires an image or video) or 10 for 2.5 (audio-only references allowed).",
      optional: true,
    },
    resolution: {
      type: "string",
      label: "Resolution",
      description: "Select a resolution supported by the model. Seedance 2.0 Standard supports 4k; Fast/Mini supports 480p/720p; 2.5 supports up to 1080p.",
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
