import acedatacloud from "../../acedatacloud.app.mjs";
import { musicModel, musicText } from "../../common/acemusic.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  key: "acedatacloud-acemusic-generate-custom-song",
  name: "ACE Music: Create song from lyrics",
  description: "Submit one paid song generation with your own lyrics, style and title. Uses ACE Music through Ace Data Cloud. [API documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
  path: "/acemusic/audios",
  props: {
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
      "description": "Title."
    },
    "model": {
      "type": "string",
      "label": "Model",
      "description": "Model.",
      "optional": true,
      "options": [
        "acemusic-v1.1",
        "acemusic-v1"
      ],
      "default": "acemusic-v1.1"
    }
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
