import docsbot_ai from "../../docsbot_ai.app.mjs";

export default {
  key: "docsbot_ai-create-source",
  name: "Create Source",
  description: "Creates a new source for a bot. [See the documentation](https://docsbot.ai/documentation/developer/source-api#create-source)",
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
      type: "string",
      label: "Source Type",
      description: "The source type. Can be url, rss, sitemap, urls, csv, document, qa or wp",
    },
    title: {
      type: "string",
      label: "Source Title",
      description: "The source title. Required only for document type",
    },
    url: {
      type: "string",
      label: "Source URL",
      description: "The source URL. Required if type is url, sitemap, or rss",
    },
    file: {
      type: "string",
      label: "Source File Path",
      description: "The source file path. Required if type is urls, csv, document, or wp",
    },
    faqs: {
      type: "string[]",
      label: "FAQs",
      description: "Required if type is qa. An array of objects like [{\"question\":\"Question text\", \"answer\":\"The answer.\"}]",
    },
    scheduleInterval: {
      type: "string",
      label: "Schedule Interval",
      description: "The source refresh scheduled interval. Can be daily, weekly, monthly, or none depending on your plan",
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
