import acedatacloud from "../../acedatacloud.app.mjs";
import {
  requiredHttpUrl, requiredText,
} from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.1",
  key: "acedatacloud-gpt-image-edit",
  name: "Edit GPT Image",
  description: "Edit an image with GPT Image and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/openai-images-edits)",
  path: "/openai/images/edits",
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
      description: "Edit instruction, e.g. `make the mug blue`.",
    },
    image: {
      type: "string",
      label: "Image URL",
      description: "Public HTTP or HTTPS source image, e.g. `https://example.com/mug.png`.",
    },
  },
  buildData: (step) => ({
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
    image: requiredHttpUrl(step.image, "Image URL"),
    response_format: "url",
  }),
});
