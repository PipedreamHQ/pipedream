import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredText } from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.2",
  key: "acedatacloud-suno-generate-music",
  name: "Generate Suno Music",
  description: "Suno music generation through Ace Data Cloud. Submit once and save the task ID; media is pending. [See the documentation](https://platform.acedata.cloud/documents/suno-audios)",
  path: "/suno/audios",
  props: {
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
      description: "Music description, e.g. `upbeat instrumental jazz with piano`.",
    },
    model: {
      type: "string",
      label: "Model",
      description: "Public Suno model, e.g. `chirp-v6`.",
      default: "chirp-v6",
    },
    instrumental: {
      type: "boolean",
      label: "Instrumental",
      description: "Generate without vocals, e.g. `true`.",
      default: false,
    },
  },
  buildData: (step) => ({
    action: "generate",
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
    custom: false,
    instrumental: step.instrumental ?? false,
  }),
});
