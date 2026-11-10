import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredText } from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.2",
  key: "acedatacloud-minimax-generate-video",
  name: "Generate MiniMax Video",
  description: "Generate a MiniMax video and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/minimax-videos)",
  path: "/minimax/videos",
  props: {
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
      description: "Video description, e.g. `a lantern floating over water`.",
    },
  },
  buildData: (step) => ({
    model: "MiniMax-H3",
    content: [
      {
        type: "text",
        text: requiredText(step.prompt, "Prompt"),
      },
    ],
    resolution: "768P",
    duration: 4,
    ratio: "16:9",
  }),
});
