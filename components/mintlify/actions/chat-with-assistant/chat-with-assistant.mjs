import mintlify from "../../mintlify.app.mjs";
import { v4 as uuidv4 } from "uuid";

export default {
  key: "mintlify-chat-with-assistant",
  name: "Chat with Assistant",
  description: "Generates a response message from the assistant for the specified domain. [See the documentation](https://www.mintlify.com/docs/api-reference/assistant/create-assistant-message)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mintlify,
    domain: {
      propDefinition: [
        mintlify,
        "domain",
      ],
    },
    fp: {
      type: "string",
      label: "FP",
      description: "Browser fingerprint or arbitrary string identifier. There may be future functionality which allows you to get the messages for a given fingerprint",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The content of the message",
    },
  },
  async run({ $ }) {
    const response = await this.mintlify.chatWithAssistant({
      $,
      domain: this.domain,
      data: {
        fp: this.fp,
        messages: [
          {
            id: uuidv4(),
            role: "user",
            content: this.message,
            parts: [
              {
                type: "text",
                text: this.message,
              },
            ],
          },
        ],
      },
    });

    $.export("$summary", `Successfully sent message with ID ${response.id}`);
    return response;
  },
};
