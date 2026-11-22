import acedatacloud from "../../acedatacloud.app.mjs";
import {
  requiredText, requiredHttpUrl,
} from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  version: "0.0.1",
  acedatacloud,
  key: "acedatacloud-digital-human-generate-video",
  name: "Generate Digital Human Video",
  description: "Animate a face photo or video with audio or a saved voice through Ace Data Cloud. [See the documentation](https://platform.acedata.cloud/documents/digital-human-videos)",
  path: "/digital-human/videos",
  props: {
    "imageUrl": {
      "propDefinition": [
        acedatacloud,
        "imageUrl",
      ],
      "label": "Face Image URL",
      "description": "Public face photo URL. Supply this or Face Video URL, not both. Example: `https://example.com/image.png`.",
      "optional": true,
    },
    "videoUrl": {
      "propDefinition": [
        acedatacloud,
        "videoUrl",
      ],
      "label": "Face Video URL",
      "description": "Public source face video. Supply this or Face Image URL, not both. Example: `https://example.com/video.mp4`.",
      "optional": true,
    },
    "audioUrl": {
      "propDefinition": [
        acedatacloud,
        "audioUrl",
      ],
      "label": "Driving Audio URL",
      "description": "Public WAV, MP3 or M4A audio. Supply this or Spoken Text with Saved Voice ID. Example: `https://example.com/audio.mp3`.",
      "optional": true,
    },
    "text": {
      "type": "string",
      "label": "Spoken Text",
      "description": "Text to speak using an existing saved voice. Omit when providing audio. Example: `Hello from Ace Data Cloud`.",
      "optional": true,
    },
    "voiceId": {
      "type": "string",
      "label": "Saved Voice ID",
      "description": "Existing Digital Human cloned voice ID, required with Spoken Text. Example: `0123456789abcdef0123456789abcdef`. Use the voice_id returned by the [Digital Human voice creation API](https://platform.acedata.cloud/documents/digital-human-voices); no voice creation is performed by this action.",
      "optional": true,
    },
  },
  buildData: (step) => {
    if (Boolean(step.imageUrl) === Boolean(step.videoUrl)) throw new Error("Supply exactly one face image or face video.");
    if (Boolean(step.audioUrl) === Boolean(step.text)) throw new Error("Supply driving audio or spoken text with a saved voice.");
    if (step.audioUrl && step.voiceId) throw new Error("Saved Voice ID is used only with Spoken Text.");
    return {
      ...(step.imageUrl
        ? {
          image_url: requiredHttpUrl(step.imageUrl, "Face Image URL"),
        }
        : {
          video_url: requiredHttpUrl(step.videoUrl, "Face Video URL"),
        }),
      ...(step.audioUrl
        ? {
          audio_url: requiredHttpUrl(step.audioUrl, "Driving Audio URL"),
        }
        : {
          text: requiredText(step.text, "Spoken Text"),
          voice_id: requiredText(step.voiceId, "Saved Voice ID"),
        }),
    };
  },
});
