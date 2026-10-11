import acedatacloud from "../../acedatacloud.app.mjs";
import { createSubmissionAction, requiredText } from "../../common/utils.mjs";

export default createSubmissionAction({
  acedatacloud,
  key: "acedatacloud-veo-generate-video",
  name: "Generate Veo Video",
  description: "Generate a Veo video and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/veo-videos)",
  path: "/veo/videos",
  props: {
    prompt: { type: "string", label: "Prompt", description: "Video description, e.g. `a river at sunrise`." },
    model: { type: "string", label: "Model", description: "Public Veo model, e.g. `veo31-fast`.", default: "veo31-fast" },
  },
  buildData: (step) => ({
    action: "text2video",
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
    aspect_ratio: "16:9",
  }),
});
