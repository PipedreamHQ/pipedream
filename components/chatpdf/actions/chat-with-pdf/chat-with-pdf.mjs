import app from "../../chatpdf.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "chatpdf-chat-with-pdf",
  name: "Chat With PDF",
  description: "Sends messages to interact with a specific PDF using its source ID. Can handle single or multiple messages for complex queries. [See the documentation](https://www.chatpdf.com/docs/api/backend)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    sourceId: {
      type: "string",
      label: "Source ID",
      description: "The source ID of the PDF in chatpdf",
    },
    messages: {
      type: "string[]",
      label: "Messages",
      description: "An array of messages to interact with the PDF. Each row should be set as a JSON string. Eg: `{\"role\": \"user\", \"content\": \"How much is the world?\"}`, `{\"role\": \"assistant\", \"content\": \"The world is 10 dollars.\"}` and `{\"role\": \"user\", \"content\": \"Where can I buy it?\"}`",
    },
    referenceSources: {
      type: "boolean",
      label: "Reference Sources",
      description: "Includes references to the PDF pages that were used to generate the response.",
      optional: true,
    },
  },
  methods: {
    chatWithPdf(args = {}) {
      return this.app.post({
        path: "/chats/message",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      chatWithPdf,
      sourceId,
      messages,
      referenceSources,
    } = this;

    const response = await chatWithPdf({
      $,
      data: {
        sourceId,
        messages: utils.parseArray(messages),
        referenceSources,
      },
    });

    $.export("$summary", "Successfully sent messages to interact with PDF");
    return response;
  },
};
