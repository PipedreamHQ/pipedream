import acedatacloud from "../../acedatacloud.app.mjs";
import { musicModel, musicText } from "../../common/acemusic.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  key: "acedatacloud-acemusic-generate-song",
  name: "ACE Music: Create song from idea",
  description: "Submit one paid song generation. Save its task ID. Uses ACE Music through Ace Data Cloud. [API documentation](https://github.com/AceDataCloud/ACEMusicAPI)",
  path: "/acemusic/audios",
  props: {
    "prompt": {
      "type": "string",
      "label": "Music or lyrics idea",
      "description": "Music or lyrics idea."
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
    custom: false,
    prompt: musicText(component.prompt, "Music or lyrics idea"),
    model: musicModel(component.model),
  }),
});
