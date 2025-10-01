import { ConfigurationError } from "@pipedream/platform";
import app from "../../bot9.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "bot9-init-chat",
  name: "Initiate Chat",
  description: "Initiates a new conversation with a Bot9 chatbot. [See the documentation](https://bot9ai.apimatic.dev/v/1_0#/rest/introduction/introduction/getting-started-with-bot9/end-user-chat-api/initchat-endpoint)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    chatbotId: {
      propDefinition: [
        app,
        "chatbotId",
      ],
    },
    source: {
      propDefinition: [
        app,
        "source",
      ],
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
    },
    externalSessionId: {
      propDefinition: [
        app,
        "externalSessionId",
      ],
    },
    userName: {
      propDefinition: [
        app,
        "userName",
      ],
    },
    userExternalId: {
      propDefinition: [
        app,
        "userExternalId",
      ],
    },
    userEmailId: {
      propDefinition: [
        app,
        "userEmailId",
      ],
    },
  },
  methods: {
    initChat({
      chatbotId, ...args
    } = {}) {
      return this.app.post({
        path: `/${chatbotId}/conversations`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      initChat,
      chatbotId,
      source,
      status,
      externalSessionId,
      userName,
      userExternalId,
      userEmailId,
    } = this;

    if (!source || !status) {
      throw new ConfigurationError("Source and Status are required.");
    }

    const response = await initChat({
      $,
      chatbotId,
      data: utils.reduceProperties({
        initialProps: {
          Source: source,
          Status: status,
        },
        additionalProps: {
          ExternalSessionId: externalSessionId,
          user: [
            {
              name: userName,
              externalId: userExternalId,
              emailId: userEmailId,
            },
            userName || userExternalId || userEmailId,
          ],
        },
      }),
    });

    $.export("$summary", `Successfully initiated conversation with ID: \`${response.id}\``);
    return response;
  },
};
