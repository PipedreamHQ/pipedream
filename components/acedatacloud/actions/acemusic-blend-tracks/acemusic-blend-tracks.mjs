import acedatacloud from "../../acedatacloud.app.mjs";
import {
  musicText, influence, twoTracks,
} from "../../common/acemusic.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  version: "0.0.1",
  acedatacloud,
  key: "acedatacloud-acemusic-blend-tracks",
  name: "ACE Music: Blend two tracks",
  description: "Submit one paid mashup with two distinct, compatible caller-owned track IDs. Uses ACE Music through Ace Data Cloud. [See the documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
  path: "/acemusic/audios",
  props: {
    "firstAudioId": {
      "propDefinition": [
        acedatacloud,
        "trackId",
      ],
      "label": "First owned track ID",
      "description": "First owned track ID. Example: `550e8400-e29b-41d4-a716-446655440000`. Use an owned, completed track from your Ace task history, not the submission task_id. See [ACE Music API](https://github.com/AceDataCloud/ACEMusicAPI).",
    },
    "secondAudioId": {
      "propDefinition": [
        acedatacloud,
        "trackId",
      ],
      "label": "Second owned track ID",
      "description": "Second owned track ID. Example: `550e8400-e29b-41d4-a716-446655440000`. Use an owned, completed track from your Ace task history, not the submission task_id. See [ACE Music API](https://github.com/AceDataCloud/ACEMusicAPI).",
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
    action: "mashup",
    model: "acemusic-v1.1",
    mashup_audio_ids: twoTracks(component.firstAudioId, component.secondAudioId),
    lyric: musicText(component.lyric, "Lyrics"),
    style: musicText(component.style, "Musical style"),
    title: component.title
      ? musicText(component.title, "Title")
      : undefined,
    audio_influence: influence(component.audioInfluence),
  }),
});
