import acedatacloud from "../../acedatacloud.app.mjs";
import {
  musicText, influence,
} from "../../common/acemusic.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  version: "0.0.1",
  acedatacloud,
  key: "acedatacloud-acemusic-cover-track",
  name: "ACE Music: Cover a track",
  description: "Submit one paid cover using a caller-owned track ID and new lyrics and style. Uses ACE Music through Ace Data Cloud. [See the documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
  path: "/acemusic/audios",
  props: {
    "audioId": {
      "propDefinition": [
        acedatacloud,
        "trackId",
      ],
      "label": "Owned track ID",
      "description": "Owned track ID. Example: `550e8400-e29b-41d4-a716-446655440000`. Use an owned, completed track from your Ace task history, not the submission task_id. See [ACE Music API](https://github.com/AceDataCloud/ACEMusicAPI).",
    },
    "lyric": {
      "propDefinition": [
        acedatacloud,
        "lyrics",
      ],
      "label": "Lyrics",
      "description": "Lyrics. Example: `A new day begins`.",
    },
    "style": {
      "propDefinition": [
        acedatacloud,
        "musicStyle",
      ],
      "label": "Musical style",
      "description": "Musical style. Example: `folk`.",
    },
    "title": {
      "propDefinition": [
        acedatacloud,
        "songTitle",
      ],
      "label": "Title",
      "description": "Title. Example: `Sunrise`.",
      "optional": true,
    },
    "audioInfluence": {
      "propDefinition": [
        acedatacloud,
        "audioInfluence",
      ],
      "label": "Audio influence (1–100)",
      "description": "Audio influence (1–100). Example: `60`.",
      "optional": true,
      "default": 60,
    },
  },
  buildData: (component) => ({
    action: "cover",
    model: "acemusic-v1.1",
    audio_id: musicText(component.audioId, "Owned track ID"),
    lyric: musicText(component.lyric, "Lyrics"),
    style: musicText(component.style, "Musical style"),
    title: component.title
      ? musicText(component.title, "Title")
      : undefined,
    audio_influence: influence(component.audioInfluence),
  }),
});
