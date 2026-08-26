// x-pd-ai: optimized
import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-retrieve-conversation",
  name: "Retrieve A Conversation",
  description: "Fetches a single Intercom conversation by ID and returns the full conversation object, including `id`, `title`, `state`, `created_at`, `conversation_parts` (the message thread), and assignee information. Use this to inspect conversation history or verify state before calling **Manage A Conversation** or **Reply To Conversation**. Example: set **Conversation ID** to `123456789` to retrieve that conversation. Pass **Fields** (e.g. `[\"id\", \"state\", \"assignee\", \"created_at\"]`) to limit the returned object to only those keys. [See the documentation](https://developers.intercom.com/docs/references/rest-api/api.intercom.io/conversations/retrieveconversation).",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    intercom,
    conversationId: {
      propDefinition: [
        intercom,
        "conversationId",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "When provided, the returned conversation object is limited to only these field names (e.g. `[\"id\", \"state\", \"assignee\", \"created_at\"]`). Omit to return the full conversation object.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.intercom.getConversation({
      $,
      conversationId: this.conversationId,
    });

    const result = this.fields?.length
      ? Object.fromEntries(this.fields.map((f) => [
        f,
        response[f],
      ]))
      : response;

    $.export("$summary", `Successfully retrieved conversation with ID: ${this.conversationId}`);
    return result;
  },
};
