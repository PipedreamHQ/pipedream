import acedatacloud from "../../acedatacloud.app.mjs";
import { createSubmissionAction, requiredText } from "../../common/utils.mjs";

export default createSubmissionAction({
  acedatacloud,
  key: "acedatacloud-grok-generate-video",
  name: "Generate Grok Video",
  description: "Generate a Grok video and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/grok-videos)",
  path: "/grok/videos",
  props: {
    prompt: { type: "string", label: "Prompt", description: "Video description, e.g. `a paper boat on a pond`." },
    model: { type: "string", label: "Model", description: "Public Grok video model, e.g. `grok-imagine-video-1.5-fast:reverse`.", default: "grok-imagine-video-1.5-fast:reverse" },
  },
  buildData: (step) => ({
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
    resolution: "480p",
    duration: 6,
  }),
});
