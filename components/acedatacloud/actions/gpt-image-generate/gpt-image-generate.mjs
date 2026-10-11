import acedatacloud from "../../acedatacloud.app.mjs";
import { createSubmissionAction, requiredText } from "../../common/utils.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.1",
  key: "acedatacloud-gpt-image-generate",
  name: "Generate GPT Image",
  description: "Generate an image with GPT Image and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/openai-images-generations)",
  path: "/openai/images/generations",
  props: {
    model: { type: "string", label: "Model", description: "Public GPT Image model, e.g. `gpt-image-2`.", default: "gpt-image-2" },
    prompt: { type: "string", label: "Prompt", description: "Image description, e.g. `a red ceramic mug`." },
    size: { type: "string", label: "Size", description: "Image size, e.g. `1024x1024`.", optional: true },
  },
  buildData: (step) => ({
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
    ...(step.size && { size: step.size }),
    response_format: "url",
  }),
});
