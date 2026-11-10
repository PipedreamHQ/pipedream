import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredText } from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  version: "0.0.2",
  key: "acedatacloud-fish-audio-synthesize",
  name: "Synthesize Fish Audio Speech",
  description: "Synthesize speech with Fish Audio and return a task ID. [See the documentation](https://platform.acedata.cloud/documents/fish-tts)",
  path: "/fish/tts",
  props: {
    text: {
      type: "string",
      label: "Text",
      description: "Words to speak, e.g. `Welcome to the show`.",
    },
    referenceId: {
      type: "string",
      label: "Reference Voice ID",
      description: "Use **Search Fish Audio Voices** to get a voice ID (the `items[]._id` field), e.g. `8d2c17a9b26d4d83888ea67a1ee565b2`.",
      optional: true,
    },
  },
  buildData: (step) => ({
    text: requiredText(step.text, "Text"),
    model: "s2-pro",
    format: "mp3",
    ...(step.referenceId && {
      reference_id: step.referenceId,
    }),
  }),
});
