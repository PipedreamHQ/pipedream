import { ConfigurationError } from "@pipedream/platform";
import app from "../../speak_ai.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "speak_ai-run-ai-chat",
  name: "Run AI Chat",
  description: "Ask a question about Speak AI media and get the answer back. Scope the question to specific media files, to a whole folder, or to both. Answers are only as good as the prompt, so be specific about the output wanted. Media must finish analyzing first. [See the documentation](https://docs.speakai.co/api/ai-chat/#post-prompt).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    prompt: {
      propDefinition: [
        app,
        "prompt",
      ],
    },
    folderId: {
      propDefinition: [
        app,
        "folderId",
      ],
      description: "A Speak AI folder ID, for example `905c208f1c07`. Get it from the `folderId` field returned by Speak AI. Answer the prompt from every media file in this folder. Set this, `mediaIds`, or both.",
      optional: true,
    },
    mediaIds: {
      propDefinition: [
        app,
        "mediaIds",
        ({ folderId }) => ({
          folderId,
        }),
      ],
      optional: true,
    },
    assistantType: {
      type: "string",
      label: "Assistant Type",
      description: "The assistant persona used to answer the prompt: `general` (default), `researcher` for academic analysis, `marketer` for content, `sales` for deal insights, or `recruiter` for hiring",
      options: constants.ASSISTANT_TYPES,
      optional: true,
      default: "general",
    },
  },
  async run({ $ }) {
    const {
      app,
      prompt,
      folderId,
      mediaIds,
      assistantType,
    } = this;

    if (!folderId && !mediaIds?.length) {
      throw new ConfigurationError("Set **Folder ID**, **Media IDs**, or both, so the prompt has media to answer from.");
    }

    const response = await app.runPrompt({
      $,
      data: {
        prompt,
        folderId,
        mediaIds,
        assistantType,
      },
    });

    const promptId = response?.data?.promptId;
    $.export("$summary", promptId
      ? `Successfully ran AI Chat \`${promptId}\``
      : "Successfully ran AI Chat");
    return response;
  },
};
