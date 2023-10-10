import docsbot_ai from "../../docsbot_ai.app.mjs";

export default {
  key: "docsbot_ai-ask-question",
  name: "Ask Question",
  description: "Ask a question to a specific bot in a specific team. [See the documentation](https://docsbot.ai/documentation/developer/chat-api)",
  version: "0.0.1",
  type: "action",
  props: {
    docsbot_ai,
    teamId: {
      propDefinition: [
        docsbot_ai,
        "teamId",
      ],
    },
    botId: {
      propDefinition: [
        docsbot_ai,
        "botId",
        (c) => ({
          teamId: c.teamId,
        }),
      ],
    },
    question: {
      propDefinition: [
        docsbot_ai,
        "question",
      ],
    },
    full_source: {
      propDefinition: [
        docsbot_ai,
        "full_source",
      ],
    },
    format: {
      propDefinition: [
        docsbot_ai,
        "format",
      ],
    },
    history: {
      propDefinition: [
        docsbot_ai,
        "history",
      ],
    },
    metadata: {
      propDefinition: [
        docsbot_ai,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.docsbot_ai.askQuestion({
      teamId: this.teamId,
      botId: this.botId,
      question: this.question,
      full_source: this.full_source,
      format: this.format,
      history: this.history,
      metadata: this.metadata,
    });
    $.export("$summary", `Successfully asked question: ${this.question}`);
    return response;
  },
};
