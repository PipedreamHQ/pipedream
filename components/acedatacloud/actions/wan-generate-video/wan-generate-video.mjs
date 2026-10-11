import acedatacloud from "../../acedatacloud.app.mjs";
import { createSubmissionAction, requiredText } from "../../common/utils.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.1",
  key: "acedatacloud-wan-generate-video",
  name: "Generate Wan Video",
  description: "Generate a Wan video and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/wan-videos)",
  path: "/wan/videos",
  props: {
    prompt: { type: "string", label: "Prompt", description: "Video description, e.g. `clouds crossing a mountain`." },
    model: { type: "string", label: "Model", description: "Public Wan model, e.g. `wan2.6-t2v`.", default: "wan2.6-t2v" },
  },
  buildData: (step) => ({
    action: "text2video",
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
    duration: 5,
    resolution: "720P",
  }),
});
