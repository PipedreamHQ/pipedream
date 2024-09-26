import app from "../../basecamp.app.mjs";

export default {
  key: "basecamp-create-campfire-chatbot-message",
  name: "Create Campfire Chatbot Message",
  description: "Creates a line in the Campfire for a Basecamp Chatbot. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/chatbots.md#create-a-line)",
  type: "action",
  version: "0.0.3",
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
    campfireId: {
      propDefinition: [
        app,
        "campfireId",
        ({
          accountId,
          projectId,
        }) => ({
          accountId,
          projectId,
        }),
      ],
    },
    botId: {
      propDefinition: [
        app,
        "botId",
        ({
          accountId,
          projectId,
          campfireId,
        }) => ({
          accountId,
          projectId,
          campfireId,
        }),
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The plain text body for the Campfire line.",
    },
  },
  async run({ $ }) {
    const {
      accountId,
      projectId,
      campfireId,
      botId,
      content,
    } = this;

    const { lines_url: url } = await this.app.getChatbot({
      $,
      accountId,
      projectId,
      campfireId,
      botId,
    });

    const message = await this.app.makeRequest({
      $,
      accountId,
      url,
      method: "POST",
      data: {
        content,
      },
    });

    $.export("$summary", "Successfully posted campfire chatbot message.");
    return message;
  },
};
