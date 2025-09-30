import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-get-entities",
  name: "Get Entities",
  description: "Get a list of the extracted entities (custom, location, person, date, number, organization, datetime, daterange etc.) from the conversation. See the doc [here](https://docs.symbl.ai/docs/conversation-api/entities/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    symblAIApp,
    conversationId: {
      propDefinition: [
        symblAIApp,
        "conversationId",
      ],
    },
  },
  async run({ $ }) {
    const { entities } = await this.symblAIApp.getEntities({
      $,
      conversationId: this.conversationId,
    });
    $.export("$summary", `Successfully retrieved ${entities.length} Entit${entities.length === 1
      ? "y"
      : "ies"} from the conversation`);
    return entities;
  },
};
