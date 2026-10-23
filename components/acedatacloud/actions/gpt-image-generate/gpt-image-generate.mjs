import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredText } from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.2",
  key: "acedatacloud-gpt-image-generate",
  name: "Generate GPT Image",
  description: "GPT Image generation through Ace Data Cloud. Submit once and save the task ID; media is pending. [See the documentation](https://platform.acedata.cloud/documents/openai-images-generations)",
  path: "/openai/images/generations",
  props: {
    model: {
      type: "string",
      label: "Model",
      description: "Public GPT Image model, e.g. `gpt-image-2`.",
      default: "gpt-image-2",
    },
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
      description: "Image description, e.g. `a red ceramic mug`.",
    },
    size: {
      type: "string",
      label: "Size",
      description: "Image size, e.g. `1024x1024`.",
      optional: true,
    },
  },
  buildData: (step) => ({
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
    ...(step.size && {
      size: step.size,
    }),
    response_format: "url",
  }),
});
