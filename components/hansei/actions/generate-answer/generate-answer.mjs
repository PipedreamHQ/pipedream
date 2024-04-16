import hansei from "../../hansei.app.mjs";

export default {
  key: "hansei-generate-answer",
  name: "Generate Answer",
  description: "Obtain an answer to a specified question. [See the documentation](https://developers.hansei.app/operation/operation-sendmessage)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    hansei,
    botId: {
      propDefinition: [
        hansei,
        "botId",
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the question",
    },
    conversationId: {
      propDefinition: [
        hansei,
        "conversationId",
        (c) => ({
          botId: c.botId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hansei.getAnswerToQuestion({
      $,
      data: {
        value: {
          bot_id: this.botId,
          content: this.content,
          conversation_id: this.conversationId,
        },
      },
    });
    $.export("$summary", `Generated answer for question: ${this.content}`);
    return response;
  },
};
