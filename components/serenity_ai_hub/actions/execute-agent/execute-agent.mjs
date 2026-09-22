import app from "../../serenity_ai_hub.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "serenity_ai_hub-execute-agent",
  name: "Execute Agent",
  description: "Executes an agent by its code with the provided parameters. [See the documentation](https://docs.serenitystar.ai/docs/api/aihub/execute-agent-with-code/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    agentCode: {
      propDefinition: [
        app,
        "agentCode",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to send to the agent",
    },
    culture: {
      propDefinition: [
        app,
        "culture",
      ],
    },
    chatId: {
      type: "string",
      label: "Chat ID",
      description: "The ID of an existing conversation to continue. Leave empty to start a new conversation",
      optional: true,
    },
    additionalParameters: {
      type: "string[]",
      label: "Additional Parameters",
      description: "Array of additional parameters with `key` and `value` properties, or a JSON string representing that array. Example: `[{\"key\": \"param1\", \"value\": \"value1\"}]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = [
      {
        Key: "message",
        Value: this.message,
      },
    ];

    if (this.chatId) {
      data.push({
        Key: "chatId",
        Value: this.chatId,
      });
    }

    if (this.additionalParameters) {
      const extra = utils.parseInputParameters(this.additionalParameters);
      data.push(...extra.map((item) => ({
        Key: item.key,
        Value: item.value,
      })));
    }

    const response = await this.app.executeAgent({
      $,
      agentCode: this.agentCode,
      params: {
        culture: this.culture,
      },
      data,
    });

    $.export("$summary", `Successfully executed agent \`${this.agentCode}\``);
    return response;
  },
};
