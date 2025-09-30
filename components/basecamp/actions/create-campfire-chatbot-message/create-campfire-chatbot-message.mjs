import app from "../../basecamp.app.mjs";
import common from "../../common/common.mjs";

export default {
  key: "basecamp-create-campfire-chatbot-message",
  name: "Create Campfire Chatbot Message",
  description: "Creates a message in a Campfire for a Basecamp Chatbot. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/chatbots.md#create-a-line)",
  type: "action",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
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
      description: "The plain text body for the Campfire message.",
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

    $.export("$summary", "Successfully posted campfire chatbot message");
    return message ?? {
      content,
    };
  },
};
