import docsbot_ai from "../../docsbot_ai.app.mjs";

export default {
  key: "docsbot_ai-create-source",
  name: "Create Source",
  description: "Creates a new source for a bot in DocsBot AI. [See the documentation](https://docsbot.ai/documentation/developer/source-api#create-source)",
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
    type: {
      propDefinition: [
        docsbot_ai,
        "type",
      ],
    },
    title: {
      propDefinition: [
        docsbot_ai,
        "title",
      ],
    },
    url: {
      propDefinition: [
        docsbot_ai,
        "url",
      ],
    },
    file: {
      propDefinition: [
        docsbot_ai,
        "file",
      ],
    },
    faqs: {
      propDefinition: [
        docsbot_ai,
        "faqs",
      ],
    },
    scheduleInterval: {
      propDefinition: [
        docsbot_ai,
        "scheduleInterval",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.docsbot_ai.createSource({
      teamId: this.teamId,
      botId: this.botId,
      type: this.type,
      title: this.title,
      url: this.url,
      file: this.file,
      faqs: this.faqs.map(JSON.parse),
      scheduleInterval: this.scheduleInterval,
    });
    $.export("$summary", `Successfully created source with ID: ${response.id}`);
    return response;
  },
};
