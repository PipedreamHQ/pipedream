import acedatacloud from "../../acedatacloud.app.mjs";
import {
  requiredText, requiredHttpUrl,
} from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  key: "acedatacloud-dreamina-generate-video",
  name: "Generate Dreamina Video",
  description: "Create a lip-synced Dreamina video from a portrait and audio through Ace Data Cloud. [See the documentation](https://platform.acedata.cloud/documents/dreamina-videos)",
  path: "/dreamina/videos",
  modelChoices: true,
  props: {
    "model": {
      "type": "string",
      "label": "Model",
      "description": "Published model from the current Dreamina API. Example: `omnihuman-1.5`.",
      "default": "omnihuman-1.5",
    },
    "imageUrl": {
      "propDefinition": [
        acedatacloud,
        "imageUrl",
      ],
      "label": "Portrait Image URL",
      "description": "Public portrait image URL. Example: `https://example.com/image.png`.",
    },
    "audioUrl": {
      "propDefinition": [
        acedatacloud,
        "audioUrl",
      ],
      "label": "Driving Audio URL",
      "description": "Public MP3 or WAV audio URL. Example: `https://example.com/audio.mp3`.",
    },
    "prompt": {
      "propDefinition": [
        acedatacloud,
        "prompt",
      ],
      "label": "Prompt",
      "description": "Optional guidance for expression, emotion and style. Example: `A calm lake at sunrise`.",
      "optional": true,
    },
    "maskUrls": {
      "propDefinition": [
        acedatacloud,
        "imageUrls",
      ],
      "label": "Subject Mask URLs",
      "description": "Optional public subject masks to select the person to animate. Example: `[\"https://example.com/image.png\"]`.",
      "optional": true,
    },
  },
  buildData: (step) => {
    return {
      model: requiredText(step.model, "Model"),
      image_url: requiredHttpUrl(step.imageUrl, "Portrait Image URL"),
      audio_url: requiredHttpUrl(step.audioUrl, "Driving Audio URL"),
      ...(step.prompt && {
        prompt: requiredText(step.prompt, "Prompt"),
      }),
      ...(step.maskUrls?.length && {
        mask_url: step.maskUrls.map((url) => requiredHttpUrl(url, "Subject Mask URL")),
      }),
    };
  },
});
