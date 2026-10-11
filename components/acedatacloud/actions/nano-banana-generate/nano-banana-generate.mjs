import acedatacloud from "../../acedatacloud.app.mjs";
import { createSubmissionAction, requiredText } from "../../common/utils.mjs";

export default createSubmissionAction({
  acedatacloud,
  key: "acedatacloud-nano-banana-generate",
  name: "Generate Nano Banana Image",
  description: "Generate a Nano Banana image and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/nanobanana-images)",
  path: "/nano-banana/images",
  props: {
    model: { type: "string", label: "Model", description: "Public Nano Banana model, e.g. `nano-banana-2-lite`.", default: "nano-banana-2-lite" },
    prompt: { type: "string", label: "Prompt", description: "Image description, e.g. `a paper lantern`." },
    aspectRatio: { type: "string", label: "Aspect Ratio", description: "Aspect ratio, e.g. `1:1`.", default: "1:1" },
    resolution: { type: "string", label: "Resolution", description: "Output resolution, e.g. `1K`.", default: "1K" },
  },
  buildData: (step) => ({
    action: "generate",
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
    aspect_ratio: step.aspectRatio,
    resolution: step.resolution,
    count: 1,
  }),
});
