import acedatacloud from "../../acedatacloud.app.mjs";
import { musicText, referenceUrl } from "../../common/acemusic.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  key: "acedatacloud-acemusic-import-mp3",
  name: "ACE Music: Import reference MP3",
  description: "Import one publicly accessible HTTPS MP3 as a separately priced reference. Uses ACE Music through Ace Data Cloud. [API documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
  path: "/acemusic/audios",
  props: {
    "audio_url": {
      "type": "string",
      "label": "Public HTTPS MP3 URL",
      "description": "Public HTTPS MP3 URL."
    },
    "name": {
      "type": "string",
      "label": "Display name",
      "description": "Display name.",
      "optional": true
    },
    "audio_id": {
      "type": "string",
      "label": "Owned track ID",
      "description": "Owned track ID.",
      "optional": true
    }
  },
  buildData: (component) => ({
    action: "upload",
    audio_url: referenceUrl(component.audio_url),
    name: component.name ? musicText(component.name, "Display name") : undefined,
    audio_id: component.audio_id ? musicText(component.audio_id, "Owned track ID") : undefined,
  }),
});
