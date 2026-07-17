import { ConfigurationError } from "@pipedream/platform";
import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-update-side-conversation",
  name: "Update Side Conversation",
  description: "Update the state or subject of a Zendesk side conversation. Use **List Side Conversations** to discover conversation IDs. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/side_conversation/side_conversation/#update-side-conversation).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    zendesk,
    ticketId: {
      propDefinition: [
        zendesk,
        "ticketId",
      ],
    },
    sideConversationId: {
      propDefinition: [
        zendesk,
        "sideConversationId",
        ({
          ticketId, customSubdomain,
        }) => ({
          ticketId,
          customSubdomain,
        }),
      ],
    },
    state: {
      type: "string",
      label: "State",
      description: "The new state of the side conversation.",
      options: [
        "open",
        "closed",
      ],
      optional: true,
    },
    subject: {
      propDefinition: [
        zendesk,
        "sideConversationSubject",
      ],
      optional: true,
    },
    customSubdomain: {
      propDefinition: [
        zendesk,
        "customSubdomain",
      ],
    },
  },
  async run({ $: step }) {
    if (!this.state && !this.subject) {
      throw new ConfigurationError("Provide a new state, subject, or both.");
    }

    const response = await this.zendesk.updateSideConversation({
      step,
      ticketId: this.ticketId,
      sideConversationId: this.sideConversationId,
      customSubdomain: this.customSubdomain,
      data: {
        side_conversation: {
          state: this.state,
          subject: this.subject,
        },
      },
    });

    step.export("$summary", `Successfully updated side conversation ${response.side_conversation.id}`);

    return response;
  },
};
