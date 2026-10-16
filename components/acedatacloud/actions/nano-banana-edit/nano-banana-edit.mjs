import acedatacloud from "../../acedatacloud.app.mjs";
import {
  requiredHttpUrl, requiredText,
} from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.1",
  key: "acedatacloud-nano-banana-edit",
  name: "Edit Nano Banana Image",
  description: "Edit a Nano Banana image and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/nano-banana-images)",
  path: "/nano-banana/images",
  props: {
    model: {
      type: "string",
      label: "Model",
      description: "Public Nano Banana model, e.g. `nano-banana-2-lite`.",
      default: "nano-banana-2-lite",
    },
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
      description: "Edit instruction, e.g. `change the lantern to blue`.",
    },
    imageUrl: {
      propDefinition: [
        acedatacloud,
        "imageUrl",
      ],
      description: "Public HTTP or HTTPS source image, e.g. `https://example.com/lantern.png`.",
    },
  },
  buildData: (step) => ({
    action: "edit",
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
    image_urls: [
      requiredHttpUrl(step.imageUrl, "Image URL"),
    ],
    count: 1,
  }),
});
