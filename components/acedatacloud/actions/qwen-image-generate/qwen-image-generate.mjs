import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredText } from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.2",
  key: "acedatacloud-qwen-image-generate",
  name: "Generate Qwen Image",
  description: "Generate a Qwen image and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/qwen-image-images)",
  path: "/qwen-image/images",
  props: {
    model: {
      type: "string",
      label: "Model",
      description: "Public Qwen Image model, e.g. `qwen-image-3.0`.",
      default: "qwen-image-3.0",
    },
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
      description: "Image description, e.g. `a watercolor fox`.",
    },
    size: {
      type: "string",
      label: "Size",
      description: "Output size, e.g. `1024*1024`.",
      default: "1024*1024",
    },
  },
  buildData: (step) => ({
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
    size: requiredText(step.size, "Size"),
    n: 1,
  }),
});
