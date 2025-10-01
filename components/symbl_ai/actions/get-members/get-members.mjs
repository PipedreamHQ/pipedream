import symblAIApp from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-get-members",
  name: "Get Members",
  description: "Get a list of all the members from the conversation. See the doc [here](https://docs.symbl.ai/docs/conversation-api/members/).",
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
    const { members } = await this.symblAIApp.getMembers({
      $,
      conversationId: this.conversationId,
    });
    $.export("$summary", `Successfully retrieved ${members.length} Member${members.length === 1
      ? ""
      : "s"} from the conversation`);
    return members;
  },
};
