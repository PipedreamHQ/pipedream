import chatpdf from "../../chatpdf.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "chatpdf-chat-with-pdf",
  name: "Chat with PDF",
  description: "Sends messages to interact with a specific PDF using its source ID. Can handle single or multiple messages for complex queries. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    chatpdf,
    sourceId: {
      propDefinition: [
        chatpdf,
        "sourceId",
      ],
    },
    messages: {
      propDefinition: [
        chatpdf,
        "messages",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.chatpdf.sendMessageToPdf({
      sourceId: this.sourceId,
      messages: this.messages,
    });

    $.export("$summary", `Sent messages to PDF with source ID ${this.sourceId}`);
    return response;
  },
};
