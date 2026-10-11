import acedatacloud from "../../acedatacloud.app.mjs";
import { createSubmissionAction, requiredText } from "../../common/utils.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.1",
  key: "acedatacloud-kling-generate-video",
  name: "Generate Kling Video",
  description: "Generate a Kling video and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/kling-videos)",
  path: "/kling/videos",
  props: {
    prompt: { type: "string", label: "Prompt", description: "Video description, e.g. `a cyclist on a coastal road`." },
    model: { type: "string", label: "Model", description: "Public Kling model, e.g. `kling-v3-turbo`.", default: "kling-v3-turbo" },
  },
  buildData: (step) => ({
    action: "text2video",
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
    mode: "std",
    duration: 5,
    aspect_ratio: "16:9",
  }),
});
