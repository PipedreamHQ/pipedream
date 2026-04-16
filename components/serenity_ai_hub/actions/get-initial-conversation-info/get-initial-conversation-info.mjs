import app from "../../serenity_ai_hub.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "serenity_ai_hub-get-initial-conversation-info",
  name: "Get Initial Conversation Info",
  description: "Gets initial conversation information. [See the documentation](https://docs.serenitystar.ai/docs/api/aihub/get-initial-conversation-info-by-agent-code)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
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
    culture: {
      propDefinition: [
        app,
        "culture",
      ],
    },
    userIdentifier: {
      type: "string",
      label: "User Identifier",
      description: "An identifier for the user",
      optional: true,
    },
    inputParameters: {
      type: "string[]",
      label: "Input Parameters",
      description: "Array of input parameters with `key` and `value` properties, or a JSON string representing that array. Example: `[{\"key\": \"param1\", \"value\": \"value1\"}]`",
      optional: true,
    },
    channel: {
      type: "string",
      label: "Channel",
      description: "Optional channel information",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.getConversationInfo({
      $,
      agentCode: this.agentCode,
      params: {
        culture: this.culture,
      },
      data: {
        userIdentifier: this.userIdentifier,
        inputParameters: this.inputParameters
          ? utils.parseInputParameters(this.inputParameters)
          : undefined,
        channel: this.channel,
      },
    });

    $.export("$summary", `Successfully retrieved conversation info for agent \`${this.agentCode}\``);
    return response;
  },
};
