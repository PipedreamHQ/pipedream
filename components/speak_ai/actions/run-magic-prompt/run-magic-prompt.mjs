import app from "../../speak_ai.app.mjs";

export default {
  key: "speak_ai-run-magic-prompt",
  name: "Run Magic Prompt",
  description: "Run a Speak AI Magic Prompt against a folder and/or specific media. [See the documentation](https://docs.speakai.co/).",
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
    },
    assistantType: {
      type: "string",
      label: "Assistant Type",
      description: "The assistant type to use for the prompt (e.g. `researcher`, `marketer`, `sales`, `general`, `recruiter`)",
      optional: true,
    },
    assistantTemplateId: {
      type: "string",
      label: "Assistant Template ID",
      description: "Optional custom assistant template to apply",
      optional: true,
    },
    mediaIds: {
      propDefinition: [
        app,
        "mediaIds",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      prompt,
      folderId,
      assistantType,
      assistantTemplateId,
      mediaIds,
    } = this;

    const response = await app.runPrompt({
      $,
      data: {
        folderId,
        prompt,
        assistantType,
        assistantTemplateId,
        mediaIds: mediaIds || [],
      },
    });

    $.export("$summary", `Successfully ran Magic Prompt \`${response?.data?.promptId || ""}\`.`);
    return response;
  },
};
