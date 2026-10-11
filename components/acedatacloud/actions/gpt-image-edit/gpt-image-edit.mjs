import acedatacloud from "../../acedatacloud.app.mjs";
import { createSubmissionAction, requiredHttpUrl, requiredText } from "../../common/utils.mjs";

export default createSubmissionAction({
  acedatacloud,
  key: "acedatacloud-gpt-image-edit",
  name: "Edit GPT Image",
  description: "Edit an image with GPT Image and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/openai-images-edits)",
  path: "/openai/images/edits",
  props: {
    model: { type: "string", label: "Model", description: "Public GPT Image model, e.g. `gpt-image-2`.", default: "gpt-image-2" },
    prompt: { type: "string", label: "Prompt", description: "Edit instruction, e.g. `make the mug blue`." },
    image: { type: "string", label: "Image URL", description: "Public HTTP or HTTPS source image, e.g. `https://example.com/mug.png`." },
  },
  buildData: (step) => ({
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
    image: requiredHttpUrl(step.image, "Image URL"),
    response_format: "url",
  }),
});
