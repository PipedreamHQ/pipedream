import openai from "../../openai.app.mjs";

export default {
  key: "openai-list-messages",
  name: "List Messages",
  description: "Lists the messages for a given thread. [See the documentation](https://platform.openai.com/docs/api-reference)",
  version: "0.0.5",
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
    after: {
      propDefinition: [
        openai,
        "after",
      ],
    },
    before: {
      propDefinition: [
        openai,
        "before",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.openai.listMessages({
      threadId: this.threadId,
      limit: this.limit,
      order: this.order,
      after: this.after,
      before: this.before,
    });

    $.export("$summary", `Successfully listed ${response.data.length} messages for thread ID ${this.threadId}`);
    return response.data;
  },
};
