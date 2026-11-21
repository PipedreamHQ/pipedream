import acedatacloud from "../../acedatacloud.app.mjs";
import { musicText, influence, twoTracks } from "../../common/acemusic.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  key: "acedatacloud-acemusic-blend-tracks",
  name: "ACE Music: Blend two tracks",
  description: "Submit one paid mashup with two distinct, compatible caller-owned track IDs. Uses ACE Music through Ace Data Cloud. [API documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
  path: "/acemusic/audios",
  props: {
    "first_audio_id": {
      "type": "string",
      "label": "First owned track ID",
      "description": "First owned track ID."
    },
    "second_audio_id": {
      "type": "string",
      "label": "Second owned track ID",
      "description": "Second owned track ID."
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
    action: "mashup",
    model: "acemusic-v1.1",
    mashup_audio_ids: twoTracks(component.first_audio_id, component.second_audio_id),
    lyric: musicText(component.lyric, "Lyrics"),
    style: musicText(component.style, "Musical style"),
    title: component.title ? musicText(component.title, "Title") : undefined,
    audio_influence: influence(component.audio_influence),
  }),
});
