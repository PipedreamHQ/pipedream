import openai from "../../openai.app.mjs";

export default {
  key: "openai-list-messages",
  name: "List Messages (Assistants)",
  description: "Lists the messages for a given thread. [See the documentation](https://platform.openai.com/docs/api-reference/messages/listMessages)",
  version: "0.0.11",
  type: "action",
  props: {
    openai,
    threadId: {
      propDefinition: [
        openai,
        "threadId",
      ],
    },
    limit: {
      propDefinition: [
        openai,
        "limit",
      ],
    },
    order: {
      propDefinition: [
        openai,
        "order",
      ],
    },
  },
  async run({ $ }) {
    const response = this.openai.paginate({
      resourceFn: this.openai.listMessages,
      args: {
        $,
        threadId: this.threadId,
        params: {
          order: this.order,
        },
      },
      max: this.limit,
    });

    const messages = [];
    for await (const message of response) {
      messages.push(message);
    }

    $.export("$summary", `Successfully listed ${messages.length} messages for thread ID ${this.threadId}`);
    return messages;
  },
};
