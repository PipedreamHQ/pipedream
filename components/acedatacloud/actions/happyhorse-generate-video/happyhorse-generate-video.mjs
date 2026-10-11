import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredText } from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.1",
  key: "acedatacloud-happyhorse-generate-video",
  name: "Generate Happy Horse Video",
  description: "Generate a Happy Horse video and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/happyhorse-videos)",
  path: "/happyhorse/videos",
  props: {
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
      description: "Video description, e.g. `a horse crossing a meadow`.",
    },
    model: { type: "string", label: "Model", description: "Public Happy Horse model, e.g. `happyhorse-1.0-t2v`.", default: "happyhorse-1.0-t2v" },
  },
  buildData: (step) => ({
    action: "generate",
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
    resolution: "720P",
    duration: 3,
    ratio: "16:9",
  }),
});
