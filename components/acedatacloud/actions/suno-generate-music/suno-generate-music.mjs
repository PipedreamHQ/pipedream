import acedatacloud from "../../acedatacloud.app.mjs";
import { createSubmissionAction, requiredText } from "../../common/utils.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.1",
  key: "acedatacloud-suno-generate-music",
  name: "Generate Suno Music",
  description: "Generate music with Suno and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/suno-audios)",
  path: "/suno/audios",
  props: {
    prompt: { type: "string", label: "Prompt", description: "Music description, e.g. `upbeat instrumental jazz with piano`." },
    model: { type: "string", label: "Model", description: "Public Suno model, e.g. `chirp-v6`.", default: "chirp-v6" },
    instrumental: { type: "boolean", label: "Instrumental", description: "Generate without vocals, e.g. `true`.", default: false },
  },
  buildData: (step) => ({
    action: "generate",
    model: requiredText(step.model, "Model"),
    prompt: requiredText(step.prompt, "Prompt"),
    custom: false,
    instrumental: step.instrumental ?? false,
  }),
});
