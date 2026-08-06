import app from "../../speak_ai.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "speak_ai-run-ai-chat",
  name: "Run AI Chat",
  description: "Ask a question about one or more media files in Speak AI and get the answer back. [See the documentation](https://docs.speakai.co/api/ai-chat/#post-prompt).",
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
    mediaIds: {
      propDefinition: [
        app,
        "mediaIds",
      ],
    },
    assistantType: {
      type: "string",
      label: "Assistant Type",
      description: "The assistant persona used to answer the prompt. Defaults to `general`",
      options: constants.ASSISTANT_TYPES,
      optional: true,
      default: "general",
    },
  },
  async run({ $ }) {
    const {
      app,
      prompt,
      mediaIds,
      assistantType,
    } = this;

    const response = await app.runPrompt({
      $,
      data: {
        prompt,
        mediaIds,
        assistantType,
      },
    });

    $.export("$summary", `Successfully ran AI Chat against ${mediaIds.length} media file(s)`);
    return response;
  },
};
