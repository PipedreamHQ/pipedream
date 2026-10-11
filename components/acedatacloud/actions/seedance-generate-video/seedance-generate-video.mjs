import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredText } from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.1",
  key: "acedatacloud-seedance-generate-video",
  name: "Generate Seedance Video",
  description: "Generate a Seedance video and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/seedance-videos)",
  path: "/seedance/videos",
  props: {
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
      description: "Video description, e.g. `a calm lake at dawn`.",
    },
    model: { type: "string", label: "Model", description: "Public Seedance model, e.g. `doubao-seedance-2-0-mini-260615`.", default: "doubao-seedance-2-0-mini-260615" },
  },
  buildData: (step) => ({
    model: requiredText(step.model, "Model"),
    content: [{ type: "text", text: requiredText(step.prompt, "Prompt") }],
    resolution: "480p",
    ratio: "16:9",
    generate_audio: false,
  }),
});
