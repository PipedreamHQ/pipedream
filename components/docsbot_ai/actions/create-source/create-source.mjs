import docsbotAi from "../../docsbot_ai.app.mjs";

export default {
  key: "docsbot_ai-create-source",
  name: "Create Source",
  description: "Create a new source for a bot. [See the documentation](https://docsbot.ai/documentation/developer/source-api#create-source)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
        ({ teamId }) => ({
          teamId,
        }),
      ],
    },
    type: {
      propDefinition: [
        docsbotAi,
        "type",
      ],
    },
    title: {
      propDefinition: [
        docsbotAi,
        "title",
      ],
    },
    url: {
      propDefinition: [
        docsbotAi,
        "url",
      ],
    },
    file: {
      propDefinition: [
        docsbotAi,
        "file",
      ],
    },
    faqs: {
      propDefinition: [
        docsbotAi,
        "faqs",
      ],
    },
    scheduleInterval: {
      propDefinition: [
        docsbotAi,
        "scheduleInterval",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.docsbotAi.createSource({
      $,
      teamId: this.teamId,
      botId: this.botId,
      data: {
        type: this.type,
        title: this.title,
        url: this.url,
        file: this.file,
        faqs: this.faqs?.map?.(JSON.parse),
        scheduleInterval: this.scheduleInterval,
      },
    });
    $.export("$summary", `Successfully created source with ID: ${response.id}`);
    return response;
  },
};
