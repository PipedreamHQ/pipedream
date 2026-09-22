import symbl_ai from "../../symbl_ai.app.mjs";

export default {
  key: "symbl_ai-list-conversation-id-options",
  name: "List Conversation Id Options",
  description: "Retrieves available options for the Conversation Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    symbl_ai,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await symbl_ai.propDefinitions.conversationId.options.call(this.symbl_ai, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
