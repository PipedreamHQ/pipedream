import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";
import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-update-side-conversation",
  name: "Update Side Conversation",
  description: "Update the state or subject of a Zendesk side conversation. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/side_conversation/side_conversation/#update-side-conversation)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
      description: "The new state of the side conversation. One of `open` or `closed`, e.g. `closed` to close the conversation.",
      options: constants.SIDE_CONVERSATION_STATE_OPTIONS,
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
          ...(this.state && {
            state: this.state,
          }),
          ...(this.subject && {
            subject: this.subject,
          }),
        },
      },
    });

    step.export("$summary", `Successfully updated side conversation ${response.side_conversation.id}`);

    return response;
  },
};
