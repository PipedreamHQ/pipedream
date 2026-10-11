import acedatacloud from "../../acedatacloud.app.mjs";
import { createSubmissionAction, requiredHttpUrl, requiredText } from "../../common/utils.mjs";

export default createSubmissionAction({
  acedatacloud,
  key: "acedatacloud-flux-edit-image",
  name: "Edit Flux Image",
  description: "Edit an image with Flux and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/flux-images)",
  path: "/flux/images",
  props: {
    model: { type: "string", label: "Model", description: "Public Flux edit model, e.g. `flux-kontext-pro`.", default: "flux-kontext-pro" },
    prompt: { type: "string", label: "Prompt", description: "Edit instruction, e.g. `add a red umbrella`." },
    imageUrl: { type: "string", label: "Image URL", description: "Public HTTP or HTTPS source image, e.g. `https://example.com/pavilion.png`." },
    size: { type: "string", label: "Size", description: "Output aspect ratio, e.g. `1:1`.", default: "1:1" },
  },
  buildData: (step) => ({
    action: "edit",
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
    image_url: requiredHttpUrl(step.imageUrl, "Image URL"),
    size: requiredText(step.size, "Size"),
    count: 1,
  }),
});
