import acedatacloud from "../../acedatacloud.app.mjs";
import { musicText, influence } from "../../common/acemusic.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  key: "acedatacloud-acemusic-cover-track",
  name: "ACE Music: Cover a track",
  description: "Submit one paid cover using a caller-owned track ID and new lyrics and style. Uses ACE Music through Ace Data Cloud. [API documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
  path: "/acemusic/audios",
  props: {
    "audio_id": {
      "type": "string",
      "label": "Owned track ID",
      "description": "Owned track ID."
    },
    "lyric": {
      "type": "string",
      "label": "Lyrics",
      "description": "Lyrics."
    },
    "style": {
      "type": "string",
      "label": "Musical style",
      "description": "Musical style."
    },
    "title": {
      "type": "string",
      "label": "Title",
      "description": "Title.",
      "optional": true
    },
    "audio_influence": {
      "type": "integer",
      "label": "Audio influence (1–100)",
      "description": "Audio influence (1–100).",
      "optional": true,
      "default": 60
    }
  },
  buildData: (component) => ({
    action: "cover",
    model: "acemusic-v1.1",
    audio_id: musicText(component.audio_id, "Owned track ID"),
    lyric: musicText(component.lyric, "Lyrics"),
    style: musicText(component.style, "Musical style"),
    title: component.title ? musicText(component.title, "Title") : undefined,
    audio_influence: influence(component.audio_influence),
  }),
});
