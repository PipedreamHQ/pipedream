import hansei from "../../hansei.app.mjs";

export default {
  key: "hansei-get-bot-conversations",
  name: "Get Bot Conversations",
  description: "Retrieves a list of conversations with the specified Bot in Hansei. [See the documentation](hhttps://developers.hansei.app/operation/operation-getbotconversations)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    hansei,
    botId: {
      propDefinition: [
        hansei,
        "botId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hansei.listConversations({
      $,
      botId: this.botId,
    });
    $.export("$summary", `Successfully retrieved ${response.length} Conversation${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
