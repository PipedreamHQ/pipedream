import zep from "../../zep.app.mjs";

export default {
  key: "zep-get-thread-messages",
  name: "Get Thread Messages",
  description: "Returns messages for the thread with the specified ID. [See the documentation](https://help.getzep.com/sdk-reference/thread/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zep,
    threadId: {
      propDefinition: [
        zep,
        "threadId",
      ],
    },
  },
  async run({ $ }) {
    const allMessages = [];
    let cursor = 0;
    const limit = 100; // Tamanho da página

    while (true) {
      const response = await this.zep.getThreadMessages({
        $,
        threadId: this.threadId,
        params: {
          limit,
          cursor,
        },
      });

      if (!response.messages || response.messages.length === 0) {
        break;
      }

      allMessages.push(...response.messages);

      // Se recebemos menos mensagens que o limite, chegamos ao fim
      if (response.messages.length < limit) {
        break;
      }

      cursor += limit;
    }

    $.export("$summary", `Successfully retrieved ${allMessages.length} messages for the thread with ID: ${this.threadId}`);

    return allMessages;
  },
};
