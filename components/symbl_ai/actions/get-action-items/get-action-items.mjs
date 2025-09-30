import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-get-action-items",
  name: "Get Action Items",
  description: "Get a list of all the action items generated from the conversation. See the doc [here](https://docs.symbl.ai/docs/conversation-api/action-items)",
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
    try {
      const { actionItems } = await this.symblAIApp.getActionItems({
        $,
        conversationId: this.conversationId,
      });
      $.export("$summary", `Successfully retrieved ${actionItems.length} Action Item${actionItems.length === 1
        ? ""
        : "s"} from the conversation`);
      return actionItems;
    } catch (error) {
      console.log("Error: ", error);
      $.export("$summary", "Failed to retrieve Action Items from the conversation");
    }
  },
};
