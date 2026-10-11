import acedatacloud from "../../acedatacloud.app.mjs";
import { createSubmissionAction, requiredText } from "../../common/utils.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.1",
  key: "acedatacloud-minimax-generate-video",
  name: "Generate MiniMax Video",
  description: "Generate a MiniMax video and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/minimax-videos)",
  path: "/minimax/videos",
  props: {
    prompt: { type: "string", label: "Prompt", description: "Video description, e.g. `a lantern floating over water`." },
  },
  buildData: (step) => ({
    model: "MiniMax-H3",
    content: [{ type: "text", text: requiredText(step.prompt, "Prompt") }],
    resolution: "768P",
    duration: 4,
    ratio: "16:9",
  }),
});
