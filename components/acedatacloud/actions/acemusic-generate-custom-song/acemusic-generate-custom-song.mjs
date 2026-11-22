import acedatacloud from "../../acedatacloud.app.mjs";
import {
  musicModel, musicText,
} from "../../common/acemusic.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  version: "0.0.1",
  acedatacloud,
  key: "acedatacloud-acemusic-generate-custom-song",
  name: "ACE Music: Create song from lyrics",
  description: "Submit one paid song generation with your own lyrics, style and title. Uses ACE Music through Ace Data Cloud. [See the documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
  path: "/acemusic/audios",
  modelChoices: true,
  props: {
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
    },
    "model": {
      "type": "string",
      "label": "Model",
      "description": "Model. Example: `acemusic-v1.1`.",
      "optional": true,
      "default": "acemusic-v1.1",
    },
  },
  buildData: (component) => ({
    action: "generate",
    custom: true,
    lyric: musicText(component.lyric, "Lyrics"),
    style: musicText(component.style, "Musical style"),
    title: musicText(component.title, "Title"),
    model: musicModel(component.model),
  }),
});
