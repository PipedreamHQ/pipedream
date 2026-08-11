// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import openphone from "../../openphone.app.mjs";
import {
  CONVERSATION_STATUS_OPTIONS,
  CONVERSATION_STATUS_SUBPATHS,
} from "../../common/constants.mjs";

export default {
  key: "openphone-update-conversation",
  name: "Update Conversation Status",
  description: "Update the status of an OpenPhone conversation. Set `conversationStatus` to `done`, `open`, or `unread`; the action routes to the corresponding OpenPhone endpoint (`mark-as-done`, `mark-as-open`, `mark-as-read`). Use **List Conversations** or **List Messages** to find the `conversationId`. Example: call with conversationId=\"CN123abc\", conversationStatus=\"done\" → marks the conversation done and returns the updated conversation. [See the documentation](https://www.openphone.com/docs/api-reference/conversations/mark-conversation-as-done)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    openphone,
    conversationId: {
      propDefinition: [
        openphone,
        "conversationId",
      ],
    },
    conversationStatus: {
      type: "string",
      label: "Conversation Status",
      description: "The status to set. One of: `done`, `open`, `unread`.",
      options: CONVERSATION_STATUS_OPTIONS,
    },
  },
  async run({ $ }) {
    const subPath = CONVERSATION_STATUS_SUBPATHS[this.conversationStatus];
    if (!subPath) {
      throw new ConfigurationError(`Invalid status "${this.conversationStatus}". Must be one of: ${CONVERSATION_STATUS_OPTIONS.join(", ")}.`);
    }
    const response = await this.openphone.updateConversationStatus({
      conversationId: this.conversationId,
      subPath,
      $,
    });
    $.export("$summary", `Updated conversation ${this.conversationId} to status "${this.conversationStatus}"`);
    return response;
  },
};
