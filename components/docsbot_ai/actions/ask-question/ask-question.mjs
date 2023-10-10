import docsbotAi from "../../docsbot_ai.app.mjs";

export default {
  key: "docsbot_ai-ask-question",
  name: "Ask Question",
  description: "Ask a question to a specific bot in a specific team. [See the documentation](https://docsbot.ai/documentation/developer/chat-api)",
  version: "0.0.1",
  type: "action",
  props: {
    docsbotAi,
    teamId: {
      propDefinition: [
        docsbotAi,
        "teamId",
      ],
    },
    botId: {
      propDefinition: [
        docsbotAi,
        "botId",
        (c) => ({
          teamId: c.teamId,
        }),
      ],
    },
    question: {
      propDefinition: [
        docsbotAi,
        "question",
      ],
    },
    fullSource: {
      propDefinition: [
        docsbotAi,
        "fullSource",
      ],
    },
    format: {
      propDefinition: [
        docsbotAi,
        "format",
      ],
    },
    history: {
      propDefinition: [
        docsbotAi,
        "history",
      ],
    },
    metadata: {
      propDefinition: [
        docsbotAi,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.docsbotAi.askQuestion({
      $,
      teamId: this.teamId,
      botId: this.botId,
      data: {
        question: this.question,
        full_source: this.fullSource,
        format: this.format,
        history: this.history,
        metadata: this.metadata,
      },
    });
    $.export("$summary", `Successfully asked question: ${this.question}`);
    return response;
  },
};
