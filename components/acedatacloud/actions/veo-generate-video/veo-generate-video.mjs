import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredText } from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.1",
  key: "acedatacloud-veo-generate-video",
  name: "Generate Veo Video",
  description: "Generate a Veo video and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/veo-videos)",
  path: "/veo/videos",
  props: {
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
      description: "Video description, e.g. `a river at sunrise`.",
    },
    model: {
      type: "string",
      label: "Model",
      description: "Public Veo model, e.g. `veo31-fast`.",
      default: "veo31-fast",
    },
  },
  buildData: (step) => ({
    action: "text2video",
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
    aspect_ratio: "16:9",
  }),
});
