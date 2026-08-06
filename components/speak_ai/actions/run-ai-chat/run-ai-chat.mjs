import app from "../../speak_ai.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "speak_ai-run-ai-chat",
  name: "Run AI Chat",
  description: "Ask a question about one or more Speak AI media files and get the answer back. Requires at least one media file, and answers are only as good as the prompt, so be specific about the output wanted. Media must finish analyzing first. [See the documentation](https://docs.speakai.co/api/ai-chat/#post-prompt).",
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
