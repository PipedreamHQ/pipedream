import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredText } from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.1",
  key: "acedatacloud-midjourney-imagine",
  name: "Imagine Midjourney Image",
  description: "Imagine an image with Midjourney and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/midjourney-imagine)",
  path: "/midjourney/imagine",
  props: {
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
      description: "Image description, e.g. `a misty mountain valley`.",
    },
    version: {
      type: "string",
      label: "Version",
      description: "Public Midjourney version, e.g. `8.2`.",
      default: "8.2",
    },
  },
  buildData: (step) => ({
    action: "generate",
    prompt: requiredText(step.prompt, "Prompt"),
    version: requiredText(step.version, "Version"),
    mode: "fast",
  }),
});
