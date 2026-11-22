import acedatacloud from "../../acedatacloud.app.mjs";
import {
  musicText, referenceUrl,
} from "../../common/acemusic.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  key: "acedatacloud-acemusic-import-mp3",
  name: "ACE Music: Import reference MP3",
  description: "Import one publicly accessible HTTPS MP3 as a separately priced reference. Uses ACE Music through Ace Data Cloud. [See the documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
  path: "/acemusic/audios",
  props: {
    "audioUrl": {
      "propDefinition": [
        acedatacloud,
        "audioUrl",
      ],
      "label": "Public HTTPS MP3 URL",
      "description": "Public HTTPS MP3 URL. Example: `https://example.com/audio.mp3`.",
    },
    "name": {
      "type": "string",
      "label": "Display name",
      "description": "Display name. Example: `Reference track`.",
      "optional": true,
    },
    "audioId": {
      "propDefinition": [
        acedatacloud,
        "trackId",
      ],
      "label": "Owned track ID",
      "description": "Owned track ID. Example: `550e8400-e29b-41d4-a716-446655440000`. Use an owned, completed track from your Ace task history, not the submission task_id. See [ACE Music API](https://github.com/AceDataCloud/ACEMusicAPI).",
      "optional": true,
    },
  },
  buildData: (component) => ({
    action: "upload",
    audio_url: referenceUrl(component.audioUrl),
    name: component.name
      ? musicText(component.name, "Display name")
      : undefined,
    audio_id: component.audioId
      ? musicText(component.audioId, "Owned track ID")
      : undefined,
  }),
});
