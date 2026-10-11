import acedatacloud from "../../acedatacloud.app.mjs";
import { createSubmissionAction, requiredText } from "../../common/utils.mjs";

export default createSubmissionAction({
  acedatacloud,
  key: "acedatacloud-flux-generate-image",
  name: "Generate Flux Image",
  description: "Generate a Flux image and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/flux-images)",
  path: "/flux/images",
  props: {
    model: { type: "string", label: "Model", description: "Public Flux model, e.g. `flux-dev`.", default: "flux-dev" },
    prompt: { type: "string", label: "Prompt", description: "Image description, e.g. `a glass pavilion`." },
    size: { type: "string", label: "Size", description: "Output size, e.g. `1024x1024`.", default: "1024x1024" },
  },
  buildData: (step) => ({
    action: "generate",
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
    size: requiredText(step.size, "Size"),
    count: 1,
  }),
});
