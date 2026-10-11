import acedatacloud from "../../acedatacloud.app.mjs";
import { createSubmissionAction, requiredText } from "../../common/utils.mjs";

export default createSubmissionAction({
  acedatacloud,
  key: "acedatacloud-flux-generate-video",
  name: "Generate Flux Video",
  description: "Generate a Flux video and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/flux-videos)",
  path: "/flux/videos",
  props: {
    model: { type: "string", label: "Model", description: "Public Flux video model, e.g. `flux-3`.", default: "flux-3" },
    prompt: { type: "string", label: "Prompt", description: "Video description, e.g. `a kite above a quiet beach`." },
  },
  buildData: (step) => ({
    action: "generate",
    mode: "t2v",
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
  }),
});
