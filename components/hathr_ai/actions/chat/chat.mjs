import hathrAi from "../../hathr_ai.app.mjs";

export default {
  key: "hathr_ai-chat",
  name: "Send Chat Message",
  description: "Sends a chat message using Hathr AI. [See the documentation](https://drive.google.com/drive/folders/1jtoSXqzhe-iwf9kfUwTCVQBu4iXVJO2x?usp=sharing)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hathrAi,
    message: {
      type: "string",
      label: "Message",
      description: "The message to send in the chat request",
    },
    documents: {
      propDefinition: [
        hathrAi,
        "documents",
      ],
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "Controls randomness (Optional, default: 0.2, range: 0-2.0)",
      optional: true,
    },
    topP: {
      type: "string",
      label: "Top P",
      description: "Controls diversity (Optional, default: 1.0, range: 0-1.0)",
      optional: true,
    },
  },
  async run({ $ }) {
    const opts = {
      $,
      data: {
        messages: [
          {
            role: "user",
            text: this.message,
          },
        ],
        temperature: this.temperature,
        topP: this.topP,
      },
    };
    const { response } = this.documents
      ? await this.hathrAi.chatWithDocuments({
        ...opts,
        data: {
          ...opts.data,
          documents: this.documents,
        },
      })
      : await this.hathrAi.chat(opts);

    $.export("$summary", `Chat request sent successfully with message: "${this.message}"`);

    return response;
  },
};
